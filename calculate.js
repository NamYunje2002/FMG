let submit = document.getElementById('submit');

submit.addEventListener('click', () => {
    calculate();
});

function getTravelTime() {
    
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