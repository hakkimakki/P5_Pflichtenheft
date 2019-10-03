var hubspotSitecoreTrack = function (trace, oncomplete) {
    if (_hsq && trace && trace.hubspottrace && trace.hubspottrace.EventId) {

        // this one goes to hubspot
        _hsq.push(["trackEvent", { id: trace.hubspottrace.EventId, value: 0 }]); 

        // this one goes to google analytics
        //ga("send", "event", "Sitecore", "click", trace.hubspottrace.EventId);
    }

    $.ajax({
        url: '/hubspot/track',
        type: 'POST',
        data: trace,
        complete: oncomplete
    });
};

var hubspotSitecoreTrace = function (domObj) {
    var eventId = null;
    if ((domObj.attr("hs-eventid") && domObj.attr("hs-eventid").length > 0))
        eventId = domObj.attr("hs-eventid");
    else if ((domObj.attr("hs-eventId") && domObj.attr("hs-eventId").length > 0))
        eventId = domObj.attr("hs-eventId");
    else
        eventId = domObj.get(0).id;

    return eventId;
};

var hubspotSitecoreGoal = function (domObj) {
    var goal = null;
    if ((domObj.attr("hs-goal") && domObj.attr("hs-goal").length > 0))
        goal = domObj.attr("hs-goal");

    return goal;
}

$(document).ready(function () {
    $(document).on("click", "a.hubspot-tracker", function (ev) {
        if (ev.target && ev.target.baseURI) {
            var _this = $(this);
            var isTargetBlank = (_this.attr("target") && _this.attr("target").toLowerCase() === "_blank");

            var eventId = hubspotSitecoreTrace(_this);

            if (!eventId || !eventId.length > 0)
                return;

            var trace = { 'hubspottrace': { 'EventId': eventId } };

            var goal = hubspotSitecoreGoal(_this);

            if (goal && goal.length > 0)
                trace.hubspottrace.GoalId = goal;

            if (isTargetBlank)
                hubspotSitecoreTrack(trace, null);
            else {
                hubspotSitecoreTrack(trace,
                    function () {
                        if (_this.attr("href") && _this.attr("href").length > 0) {
                            try {
                                window.location.href = _this.attr("href");
                            } catch (e) { console.log(e); }
                        }
                    });
                return false;
            }
        }


    });

    if (document.querySelector("video[hs-enabled='hubspot-tracker']")) {
        document.querySelector("video[hs-enabled='hubspot-tracker']").addEventListener("play", function (e) {
            if (this.currentTime === 0) {
                var _this = $(this);

                var eventId = hubspotSitecoreTrace(_this);

                if (!eventId || !eventId.length > 0)
                    return;

                var trace = { 'hubspottrace': { 'EventId': eventId } };

                var goal = hubspotSitecoreGoal(_this);

                if (goal && goal.length > 0)
                    trace.hubspottrace.GoalId = goal;

                hubspotSitecoreTrack(trace, null);
            }
        }, true);
    }
});

