import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../Contexts/Contexts'
import Feed from '../Feed/Feed'
import { feedTypes } from '../FeedEnum/FeedEnum'

const SavedPosts = () => {

    const { user } = useContext(UserContext)
    const [shouldFeedChange, setShouldFeedChangeSwitch] = useState(false)

    return (

        <div className='body_sections'>

            <div className='left_sidebar_emptiness'/>

            <div className='posts_section'>
                <div className='w-full border-t border-t-2 border-t-orange-700 bg-white flex items-center justify-center gap-2 text-xl py-2'>
                    <img width="20" height="20" src="https://img.icons8.com/office/40/bookmark-ribbon--v1.png" alt="bookmark-ribbon--v1"/>
                    <span>Saved Posts</span>
                </div>
                <FeedContext.Provider value={{ shouldFeedChange, setShouldFeedChangeSwitch, userId: user._id }}>
                    <Feed feedType={feedTypes.SavedPostsFeed}/>
                </FeedContext.Provider>
            </div>

            <div className='.right_sidebar_emptiness'/>

        </div>

    )

}

export default SavedPosts