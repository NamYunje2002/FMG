let submit = document.getElementById('submit');

submit.addEventListener('click', () => {
    getTravelTime();
});

function getTravelTime() {
    let link = 'https://map.naver.com/p/directions/14144941.7038458,4517431.0588932/14146949.5228015,4516588.3496246/-/transit?c=15.00,0,0,0,dh'
    location.href=link;
    location.replace(link);
    window.open(link);
}

/* 유저 마커를 기준으로 반지름이 radius인 원 그리기(마커로 표시) */
/*
let usersCirclePoints = [];
function calculate() {
    for(let i = 0; i < getUserCount(); i++) {
        let lat = markerList[i].getPosition().lat();
        let lng = markerList[i].getPosition().lng();
        let radius = 0.1;
        let points = 360;
        let circlePoints = [];
        for(let j = 0; j < points; j+=10) {
            let angle = (j / points) * 2 * Math.PI;
            
            circlePoints.push(new naver.maps.Marker({
                position : new naver.maps.LatLng(lat+(radius * Math.cos(angle)), lng+(radius * Math.sin(angle))),
                map : map
            }));
        }
        usersCirclePoints.push(circlePoints);
    }
}
*/