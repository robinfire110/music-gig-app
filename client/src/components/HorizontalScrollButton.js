import React from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faChevronLeft, faChevronRight} from '@fortawesome/free-solid-svg-icons'

function HorizontalScrollButton({dir, onClick}) {
    //Functions
    function getIcon(dir)
    {
        if (dir == "left") return faChevronLeft;
        else return faChevronRight;
    }

    return (
    <>
        <button onClick={onClick} style={{verticalAlign: "middle", color: "blue", border: "none", textAlign: "center", padding: "16px", cursor: "pointer", backgroundColor: "rgba(0,0,0,0)"}}><FontAwesomeIcon icon={getIcon(dir)} /></button>
    </>
    )
}

export default HorizontalScrollButton