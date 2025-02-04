import {useState, useEffect} from 'react'
import Post from '../Post/Post'

import PageLoader from '@/app/pageloader'
import ComponentWaiter from '@/app/componentwaiter'
import { GetProfileFeed } from '../FeedDbQueries/ProfileFeedQuery'
import { feedTypes } from '../FeedEnum/FeedEnum'
import { GetSavedPostsFeed } from '../FeedDbQueries/SavedPostsFeedQuery'
import { useFeedContext } from '../Contexts/FeedContext'
import { GetMainFeed } from '../FeedDbQueries/MainFeedQuery'
import "@/app/_styles/feedcontainer.css"

const Feed = ({ feedType, userId }) => {

    const { posts, getFeedPosts, loading, fetchError, setLoading, handleFetchError, lastAddedPost, attachFeedPosts } = useFeedContext()
    const [ waitingSeconds, setWaitingSeconds ] = useState(3)
    const [ loadData, setLoadData ] = useState(false)
    const [ buttonLoading, setButtonLoading ] = useState(true)
    const [ renderLoadDataButton, setRenderLoadDataButton ] = useState(true)

    const [pagination, setPagination] = useState({

        page: 1,
        limit: 10,
        totalPosts: 0,
        totalPages: 0
        
    })

    useEffect(() => {

        if(pagination.page === 1) {
            setLoading(true)
        }

        const fetchData = async () => {

            let feedData = []

            try {

                if(!userId) return

                switch (feedType) {

                    case feedTypes.ProfileFeed:

                        feedData = await GetProfileFeed(userId, pagination, setPagination, setRenderLoadDataButton)

                    break;

                    case feedTypes.MainFeed:

                        feedData = await GetMainFeed(userId, pagination, setPagination, setRenderLoadDataButton)
                        
                    break;

                    case feedTypes.SavedPostsFeed:
                    
                        feedData = await GetSavedPostsFeed(userId, pagination, setPagination, setRenderLoadDataButton)

                    break;
                
                    default:
                        break;

                }

                if(pagination.page === 1) {

                    getFeedPosts(feedData)

                } else {

                    attachFeedPosts(feedData)

                }
                

            } catch (error) {
                handleFetchError(true)
            } finally {
                
                setLoading(false)
                setButtonLoading(false)

                if (pagination.page === pagination.totalPages) {
                    setRenderLoadDataButton(false)
                } 

            }

        }
 
        fetchData()

    }, [userId, loadData])
    
    useEffect(() => {

        let timer;
    
        if (fetchError) {

            timer = setInterval(() => {

                setWaitingSeconds(prev => {

                    if (prev > 1) {
                        return prev - 1
                    } else {
                        return 3
                    }
                })

            }, 1000)
            
        }
    
        return () => clearInterval(timer)

    }, [fetchError])

    const renderNoPostsMessage = () => {

        if (userId) {

            if (feedType === feedTypes.SavedPostsFeed) {

                return (
                    <div className="flex items-center justify-center mt-6 py-5 flex-col gap-5 border border-yellow-300 bg-yellow-100 text-orange-700">
                        <img width="48" height="48" src="https://img.icons8.com/color/48/general-warning-sign.png" alt="general-warning-sign"/>
                        <p>There are no saved posts. To save one, click on the &quot;...&quot; button <br />at the top-right of any post and select &quot;Save Post&quot;.</p>
                    </div>
                )

            } else if (feedType === feedTypes.MainFeed) {

                return (
                    <div className="flex items-center justify-center mt-6 py-5 flex-col gap-5 border border-yellow-300 bg-yellow-100 text-orange-700">
                        <img width="48" height="48" src="https://img.icons8.com/color/48/general-warning-sign.png" alt="general-warning-sign"/>
                        <p>There are no post to show. In main feed, user sees his/her posts <br />mixed with the users he/she follows. Please follow others or share your thoughts.</p>
                    </div>
                )

            } else if (feedType === feedTypes.ProfileFeed) {

                return (
                    <div className="flex items-center justify-center mt-6 py-5 flex-col gap-5 border border-yellow-300 bg-yellow-100 text-orange-700">
                        <img width="48" height="48" src="https://img.icons8.com/color/48/general-warning-sign.png" alt="general-warning-sign"/>
                        <p>There are no post to show. You might consider <br />sharing your thoughts with others.</p>
                    </div>
                )

            } else {

                return null

            } 

        }

    }

    const LoadMore = () => {

        setButtonLoading(val => !val)

        setPagination((prev) => ({
            ...prev,
            page: prev.page + 1
        }))
        
        setLoadData(val => !val)
    }

    return (

        <div className="feed_container">
            {
                fetchError ? (

                    <div className="fetch-error-container">

                        <ComponentWaiter />
                        <p>An error occured while fetching posts.</p>
                        <p>Please refresh the page or it will refreshed in { waitingSeconds } seconds automatically.</p>

                    </div>

                ) : (

                    loading ?
                        <PageLoader />
                        :
                        (
                            posts ? (

                                posts.length !== 0 ? (
                                    
                                    <div className="w-full">
                                        
                                        {
                                        
                                            posts?.map((post) => (
                                                <div key={post._id} className={`${lastAddedPost === post._id ? 'blink':""}`}>
                                                    <Post post={post} />
                                                </div>
                                            ))
                                        
                                        }
                                        {

                                            renderLoadDataButton ? (

                                                <div className="loadmore_button_container">

                                                <button className="loadmore_button" 
                                                    onClick={() => {
    
                                                        LoadMore()
    
                                                    }}>{buttonLoading ? "Loading..." : "Load More"}</button>
    
                                                </div>

                                            ) : null

                                        }

                                    </div>

                                ) : (
                                    renderNoPostsMessage()
                                )
                            ) : null

                        )

                )
                
            }
        </div>
    )

}

export default Feed