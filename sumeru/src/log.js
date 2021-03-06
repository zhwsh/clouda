
var _log = function(){
	console && console.log.apply(this, arguments);
};

// 位标记 低位为前端, 高位为后端. 
var logTrace_level = 1;     //0前后端都不打,  1 仅前端,  2 仅后端 , 3 前后端同时

var configLogTrace = function(v){
    logTrace_level = v;
};

var getLogTrace = function(pos){
    
    if(logTrace_level == 0){
        return '';
    }
    
    if(!!sumeru.IS_SUMERU_SERVER && (logTrace_level & 2 == 0)){
        return '';
    }
    
    if(!sumeru.IS_SUMERU_SERVER && (logTrace_level & 1 == 0)){
        return '';
    }
    
    var stackStr = '' , atStr = "" ; //, startPos , endPos;
    
//    if(Error.captureStackTrace){
//        var err = new Error();
//        Error.captureStackTrace(err, pos);
//        stackStr = err.stack;
//    }else{
        try{
            throw new Error();
        }catch(e){
            stackStr = (e.stack.split('\n'));
        }
//    }
    
    if(stackStr[0] == 'Error'){
        atStr = stackStr[3];
    }else{
        atStr = stackStr[2];
    }
    
    return atStr;
};

var arrPush = Array.prototype.push;
var runnable = function(sumeru){
    
    var log_level = sumeru.SUMERU_APP_FW_DEBUG || false;
    
    var log = {
        
        log : function(){
            
            arrPush.call(arguments,getLogTrace(arguments.callee));
            
            _log.apply(console, arguments);
        },
        
        dev : function(){
            if(log_level !== false){
                arrPush.call(arguments,getLogTrace(arguments.callee));
                _log.apply(console, arguments);
            }
        }
    };
    
    sumeru.__reg('log', log.log);
    sumeru.__reg('dev', log.dev);
    sumeru.__reg('ConfigLogTrace', configLogTrace);
    
    return log;
};


if(typeof module !='undefined' && module.exports){
    module.exports = runnable;
}else{
    runnable(sumeru);
}
