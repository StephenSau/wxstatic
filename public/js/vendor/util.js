
/*as jQuery bind*/
function addHandler(element, type, handler){
    if (element.addEventListener){
        element.addEventListener(type, handler, false);
    } else if (element.attachEvent){
        element.attachEvent("on" + type, handler);
    } else {
        element["on" + type] = handler;
    }
}

/*as jQuery unbind*/
function removeHandler(element, type, handler){
    if (element.removeEventListener){
        element.removeEventListener(type, handler, false);
    } else if (element.detachEvent){
        element.detachEvent("on" + type, handler);
    } else {
        element["on" + type] = null;
    }
}


/*as jQuery insertAfter*/
function nextSib(t){
    var n = t.nextSibling;
    if(t.nextSibling.nodeType !== 1){
        n=n.nextSibling;
    }
    return n;
}

function insertAfter(newChild,target){
    var oParent = target.parentNode;
    if(oParent.lastChild === target){
        oParent.appendChild(newChild);
    }else{
        oParent.insertBefore(newChild,nextSib(target));
    }
}

/*add class function, allow multi-class that separate by space*/
function addClass(element, className){
    var elementClass = element.className;
    if(elementClass === ""){
        elementClass = className;
    }else{
        var classes = className.split(/\s+/);
        for(var i = 0, length = classes.length; i < length; i++){
            if(elementClass.indexOf(classes[i]) === -1){
                elementClass += " " + classes[i];
            }
        }

    }
    element.className = elementClass
}

/*remove class function, allow multi-class that separate by space*/
function removeClass(element, className){
    var elementClass = element.className;
    if(elementClass === ""){
        return;
    }else{
        var classes = className.split(/\s+/);
        for(var i = 0, length = classes.length; i < length; i++){
            elementClass = elementClass.replace(classes[i], "");
        }
        elementClass = elementClass.replace(/\s{2,}/g, " ");
        elementClass.trim();
        element.className = elementClass;
    }
}