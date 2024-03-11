import React from 'react';
import { OverlayTrigger, Button, Popover } from 'react-bootstrap';

//Popovers (tool tips)
const createPopover = (text="") => {
    return (
        <Popover id="popover-trigger-hover-focus" title="Tool Tip" style={{padding: "5px"}}>{text}</Popover>
    )
};

function TooltipButton({buttonVarient="light", text="Tool tip", activate=['hover', 'focus']}) {
    return (
        <OverlayTrigger trigger={activate} placement="top" overlay={createPopover(text)}><Button variant={buttonVarient}>?</Button></OverlayTrigger>
    )
}

export default TooltipButton;