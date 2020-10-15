(function ($, Drupal, drupalSettings) {

    var eplDoc = document; 
    var eplLL = false;
    var eS1 = 'us.img.e-planning.net';
    var eplArgs = { 
        iIF:1,
        sV:schemeLocal() + "://ads.us.e-planning.net/" ,
        vV:"4",
        sI:"11249",
        sec:"",
        eIs:[],
        //custom: {}
    };
    var eplayer = false;
    var dugout = false;

    function eplCheckStart(reinit) {
        if (document.epl) {
            var e = document.epl;
            if(reinit == 0){
                if (e.eplReady()) {
                    return true;
                } else {
                    e.eplInit(eplArgs);
                    if (eplArgs.custom) {
                        for (var s in eplArgs.custom) {
                            document.epl.setCustomAdShow(s, eplArgs.custom[s]);
                        }
                    }
                    return e.eplReady();   
                }
            }else{
                e.eplInit(eplArgs);
                if (eplArgs.custom) {
                    for (var s in eplArgs.custom) {
                        document.epl.setCustomAdShow(s, eplArgs.custom[s]);
                    }
                }
                return e.eplReady();
            }
        } else {
            if (eplLL) return false;
            if (!document.body) return false; var eS2; var dc = document.cookie;
            var cookieName = ('https' === schemeLocal() ? 'EPLSERVER_S' : 'EPLSERVER') + '=';
            var ci = dc.indexOf(cookieName);
            if (ci != -1) {
                ci += cookieName.length; var ce = dc.indexOf(';', ci);
                if (ce == -1) ce = dc.length;
                eS2 = dc.substring(ci, ce);
            }
            var eIF = document.createElement('IFRAME');
            eIF.src = 'about:blank'; eIF.id = 'epl4iframe'; eIF.name = 'epl4iframe';
            eIF.width=0; eIF.height=0; eIF.style.width='0px'; eIF.style.height='0px';
            eIF.style.display='none'; document.body.appendChild(eIF);
            
            var eIFD = eIF.contentDocument ? eIF.contentDocument : eIF.document;
            eIFD.open();eIFD.write('<html><head><title>e-planning</title></head><bo'+'dy></bo'+'dy></html>');eIFD.close();
            var s = eIFD.createElement('SCRIPT');
            s.src = schemeLocal() + '://' + (eS2?eS2:eS1) +'/layers/epl-41.js';
            eIFD.body.appendChild(s);
            if (!eS2) {
                var ss = eIFD.createElement('SCRIPT');
                ss.src = schemeLocal() + '://ads.us.e-planning.net/egc/4/111bd';
                eIFD.body.appendChild(ss);
            }
            eplLL = true;
            return false;
        }
    }

    function eplSetAdM(eID,custF) {
        if (eplCheckStart(0)) {
            if (custF) { document.epl.setCustomAdShow(eID,eplArgs.custom[eID]); }
            document.epl.showSpace(eID);
        } else {
            setTimeout(function(){ eplSetAdM(eID, (custF?'true':'false')); }, 250);
        }
    }

    function eplAD4M(eID,custF) {
        if (custF) {
            if (!eplArgs.custom) { eplArgs.custom = {}; }
            eplArgs.custom[eID] = custF;
        }
        eplSetAdM(eID, custF?true:false);
    }

    function schemeLocal() {
        var protocol = 'http';
        if (document.location.protocol) {
            protocol = document.location.protocol;
        } else {
            protocol = window.top.location.protocol;
        }
        if (protocol) {
            if (protocol.indexOf('https') !== -1) {
                return 'https';
            } else {
                return 'http';
            }
        }
    }

    function adsReady(ads) {
        ads.forEach(function (element, key) {
            let id = 'AdRef'+element;
            let ad = 'eplAdDiv'+element;

           // if($('#'+ad).length == 0) {
                var div = document.createElement("div");
                div.id = ad;
                document.getElementById(id).appendChild(div);
                if(key == 0) {
                    var script = document.createElement("script");
                    script.type = "text/javascript";
                    script.innerHTML = "var eplDoc = document;";
                    document.getElementById(id).appendChild(script);
                }
                eplAD4M(element);
           // }
        });
    }

    Drupal.behaviors.custom_ads = {
        attach: function(context, settings) {
            if(typeof settings.settings.custom_ads !== 'undefined') {
                var ads = settings.settings.custom_ads, ads_ready;
                Object.keys(ads).forEach(function (key) {
                    switch(ads[key].type){
                        case 'eplanning':
                            if(!eplArgs.eIs.includes(ads[key].space)){
                                eplArgs.sec = ads[key].section;
                                eplArgs.eIs.push(ads[key].space);
                                //eplArgs.custom[ads[key].space] = false;
                            }
                            break;
                        case 'eplayer':
                            if(!eplayer){
                                eplayer = true;
                                var script = document.createElement("script");
                                script.type = "text/javascript";
                                script.src = "//player.performgroup.com/eplayer.js#"+ads[key].space;
                                document.getElementById("eplayer-"+ads[key].space).appendChild(script);
                            }
                            break;
                        case 'dugout':
                            if(!dugout){
                                dugout = true;
                                var iframe = document.createElement("iframe");
                                iframe.type = "text/javaiframe";
                                iframe.src = "https://embed.dugout.com/v2/?p="+ads[key].space;
                                iframe.width = "100%";
                                iframe.frameborder = "0";
                                iframe.allowfullscreen = true;
                                iframe.scrolling="no";
                                document.getElementById("dugout-"+ads[key].space).appendChild(iframe);
                            }
                            break;
                    }
                });

                eplCheckStart(1);
                setTimeout(function(){ adsReady(eplArgs.eIs)}, 1000);
            }
        }
    };
})(jQuery, Drupal, drupalSettings);
