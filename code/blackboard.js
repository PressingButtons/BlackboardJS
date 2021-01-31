import { Blackboard_Engine as BBE } from "/code/Blackboard_Engine.js";
import { Blackboard_Chat   as BBC } from "/code/Blackboard_Chat.js";

let Blackboard = (function(socket){

  let view = BBE.createBlackboardCanvas( 1920, 1200 );
  $('#blackboard').html( view.canvas );

})(io());
