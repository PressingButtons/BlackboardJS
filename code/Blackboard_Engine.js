'use strict';
let tool = { active: false, type: 'pen', value: '#FFF', size: 5 }

const setCanvasListeners = canvas => {
  canvas.onpointercancel = canvasPointerListener;
  canvas.onpointerdown  = canvasPointerListener;
  canvas.onpointerenter = canvasPointerListener;
  canvas.onpointerleave = canvasPointerListener;
  canvas.onpointermove  = canvasPointerListener;
  canvas.onpointerover  = canvasPointerListener;
  canvas.onpointerout   = canvasPointerListener;
  canvas.onpointerup    = canvasPointerListener;
  canvas.gotpointercapture = canvasPointerListener;
  canvas.lostpointercapture = canvasPointerListener;
  document.onkeydown = event => { canvasKeyboardListener( event, canvas ) };
}

const canvasKeyboardListener = (event, canvas) => {
  if( event.key == 'space' && event.shift ) {
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height );
  }
}

const canvasPointerListener = event => {
  let pointer_position = getPointerPosition( event );
  if( event.pointerType == 'mouse' || event.pointerType == 'pen' || event.pointerType == 'touch') processPointerEvent( event, pointer_position );
  else console.error(`Pointer Type [${event.pointerType}] is not supported`);
}

const getPointerPosition = event => {
  let rect = event.target.getBoundingClientRect( );
  return {
    x: event.clientX - rect.x, y: event.clientY - rect.y,
    dx: event.movementX, dy: event.movementY,
  }
}

const onPointerDown = ( event, position) => {
  tool.active = true;
  performToolAction( event, position );
}

const onPointerMove = ( event, position) => {
  if( tool.active ) performToolAction( event, position );
}

const onPointerUp = (event, position) => {
  tool.active = false;
}

const performToolAction = ( event, position) => {
  if( tool.type == 'pen' ) toolActionPen( event, position );
}

const processPointerEvent = ( event, position ) => {
  if( event.type == 'pointerdown' ) onPointerDown( event, position );
  else if ( event.type == 'pointermove') onPointerMove( event, position );
  else if ( event.type == 'pointerup' ) onPointerUp( event, position );
}

const toolActionPen = ( event , position) => {
  let ctx = event.target.getContext('2d');
  ctx.beginPath( );
  ctx.strokeStyle = tool.value;
  ctx.lineWidth = Math.round( tool.size + (tool.size * event.pressure) * 0.45 );
  ctx.moveTo( position.x - position.dx, position.y - position.dy );
  ctx.lineTo( position.x, position.y );
  ctx.stroke( );
  ctx.closePath( );
}



const createCanvas  = ( width, height ) => {
  let canvas = document.createElement('canvas');
  canvas.width = width; canvas.height = height;
  setCanvasListeners( canvas );
  return { canvas: canvas, ctx: canvas.getContext('2d') }
}


const  Blackboard_Engine = (function( ) {

  const createBlackboardCanvas = ( width, height ) => {
    return createCanvas( width, height );
  }


  return {
    createBlackboardCanvas: createBlackboardCanvas
  }

})( );

export { Blackboard_Engine };
