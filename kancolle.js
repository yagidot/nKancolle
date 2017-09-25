var observer;
var domSelector = 'img, a, figure, div';

function createObserver () {
   return new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0 ) {
                mutation.addedNodes.forEach(function (node) {
                    if (node) {
                        replaceImages(domSelector, node);
                    }
                });
            }
        });

        observer.disconnect();
        runObserver();
    });
}

function runObserver () {
    // kancolle
    chrome.runtime.sendMessage({msg: 'getDisabled'}, function(response) {
        if (!response.disabled) {
            replaceImages(domSelector);
            var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
            observer = createObserver();
            observer.observe(document.body, { childList: true, subtree: true });
        }
    });
};
runObserver();

function replaceImages(selector, node) {
    var objects;
    if (node) {
        if (node.querySelectorAll) {
            objects = [ node, ...node.querySelectorAll(selector) ];
        } else {
            objects = [ node ];
        }
    } else {
        objects = document.querySelectorAll(selector);
    }
    var imagePrefix = 'https://pbs.twimg.com/media/';
    var imageSrcs = [
        'DKj37AyXUAAByIw.png', 'DKfQpTEWAAAH2Rh.jpg', 'DKas271XcAAtkkG.jpg', 'DKWaLcBXcAIjP1M.jpg',
        'DKjtmd3WkAA-VDU.jpg', 'DKgAt0uXUAIiaI6.jpg', 'DKaihvrXUAAGkc3.jpg', 'DKWFlNpXUAI7Baf.jpg',
        'DKjmwQAX0AAvyCz.jpg', 'DKePb9qW4AAbt4t.jpg', 'DKZoLGIWAAAQSKL.jpg', 'DKV0aPTXoAEPI3Z.jpg',
        'DKjSJZcVoAI2TXQ.jpg', 'DKdppzsWAAE3vZf.jpg', 'DKYxPiBWAAAJwJy.jpg', 'DKVmrUxWAAMl5hk.jpg',
        'DKjEbi5XkAA4rFA.jpg', 'DKdiyUcXUAI5W4f.jpg', 'DKYm70BXUAASn4x.jpg', 'DKVOqocXcAEznGj.jpg',
        'DKi2rLZXUAYWBS9.png', 'DKdRnvlXkAMM2s-.jpg', 'DKYO7Q7XoAAinyw.jpg', 'DKVHyEaWsAA0kac.jpg',
        'DKio9QfXcAAqii5.jpg', 'DKdHWT1XUAAYWSe.jpg', 'DKX24LMWkAAFVhM.jpg', 'DKUbJrkWkAA4NKS.jpg',
        'DKiUVceWkAAWAFw.jpg', 'DKceITWXkAAmMNX.jpg', 'DKXiShuWAAAQx-E.png', 'DKUXt-wWsAAP-GD.jpg',
        'DKiNelFW4AARmh1.jpg', 'DKbnM60WAAA-HN-.jpg', 'DKXe2B6WkAEpfVG.jpg', 'DKUQ235WsAAYoUH.jpg',
        'DKhntpNW0Ag1pQ5.jpg', 'DKbuEdKX0AIkaue.jpg', 'DKWn6VlWAAo8T8G.jpg', 'DKT1YgmXcAABjeU.jpg',
        'DKhg1duXcAIzIrj.jpg', 'DKbBcXEXcAAqiv1.jpg', 'DKWkfFGXkAEP0cV.jpg', 'DKTB5InXUAEKH8v.jpg',
        'DKhFYVAXcAkIiMh.jpg', 'DKawQ5oWkAAso5y.jpg', 'DKWdnuJWAAANniv.jpg', 'DKR5zHUX0AASG-I.jpg',
        'DKg0NYaW0AYmocQ.jpg'
    ];
    for (var i = 0; i < objects.length; i++) {
        var imgSrc = imagePrefix + imageSrcs[Math.floor(Math.random()*imageSrcs.length)];
        var object = objects[i];

        if (object.classList && object.classList.contains('kancolle-injected')) {
            continue;
        }

        if (object.src && 'IMG' === object.tagName) {
            // adjust width & height before replace it
            if (object.srcset) {
                object.removeAttribute('srcset');
            }
            if (object.getAttribute('ori-src')) {
                object.removeAttribute('ori-src');
            }
            if (object.getAttribute('data-original')) {
                object.removeAttribute('data-original');
            }
            if (object.getAttribute('data-orig-file')) {
                object.removeAttribute('data-orig-file');
            }
            if (object.style) {
                if (!object.outerHTML.match('width=')) {
                    if (object.clientWidth > 1) {
                        object.style.width = object.clientWidth + 'px';
                    } else {
                        if (!object.style.width) {
                            object.style.maxWidth = '100%';
                        }
                    }
                } else {
                    if (object.width > 2) {
                        object.style.width = object.width + 'px';
                    }
                }
                if (!object.outerHTML.match('height=')) {
                    if (object.clientHeight > 1) {
                        object.style.height = object.clientHeight + 'px';
                    } else {
                        if (!object.style.height) {
                            object.style.height = 'auto';
                        }
                    }
                } else {
                    if (object.width > 2) {
                        object.style.height = object.height + 'px';
                    }
                }
                if (!object.style.objectFit) {
                    object.style.objectFit = 'cover';
                }
            }
            object.setAttribute('kancolle-orig-src', object.src);
            object.setAttribute('kancolle-src', imgSrc);
            object.onmouseover = function () {
                this.src = this.getAttribute('kancolle-orig-src');
            };
            object.onmouseout = function () {
                this.src = this.getAttribute('kancolle-src');
            };
            object.src = object.getAttribute('kancolle-src');
            object.classList.add('kancolle-injected');
        } else if (object.style && undefined !== object.style.backgroundImage && '' !== object.style.backgroundImage) {
            object.setAttribute('kancolle-orig-bgimg', object.style.backgroundImage);
            object.setAttribute('kancolle-orig-bgpos', object.style.backgrounPosition);
            object.setAttribute('kancolle-bgimg', "url('" + imgSrc + "')");
            object.setAttribute('kancolle-bgpos', 'center');
            object.onmouseover = function () {
                this.style.backgroundImage = this.getAttribute('kancolle-orig-bgimg');
                this.style.backgroundImage = this.getAttribute('kancolle-orig-bgpos');
            };
            object.onmouseout = function () {
                this.style.backgroundImage = this.getAttribute('kancolle-bgimg');
                this.style.backgroundImage = this.getAttribute('kancolle-bgpos');
            };
            object.style.backgroundImage = object.getAttribute('kancolle-bgimg');
            object.style.backgroundImage = object.getAttribute('kancolle-bgpos');
            object.classList.add('kancolle-injected');
        }
    }
}