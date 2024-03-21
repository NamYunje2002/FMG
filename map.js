let markerList = [];

var map = new naver.maps.Map("map", {
    center: new naver.maps.LatLng(37.3595704, 127.105399),
    zoom: 15
});

var infoWindow = new naver.maps.InfoWindow({
    anchorSkew: true
});

function getUserCount() {
    return document.getElementById('user_count').textContent;
}

function deleteMarker() {
    let userCount = getUserCount();
    for(let i = userCount; i < 6; i++) markerList[i] = undefined;
    for(let i = 0; i < 6; i++) console.log(markerList[i]);
}

function saveAddress(num, latlng) {
    let userAddress = document.getElementById('user'+num+'_address');
    let address = document.getElementById('address_div').innerText;
    userAddress.innerText = address;

    if(markerList[num-1] === undefined) {
        markerList[num-1] = new naver.maps.Marker({
            position: latlng,
            map: map
        });
    }else{
        markerList[num-1].setPosition(latlng);
    }
    infoWindow.close();
}

function searchCoordinateToAddress(latlng) {
    infoWindow.close();

    naver.maps.Service.reverseGeocode({
        coords: latlng,
        orders: [
            naver.maps.Service.OrderType.ADDR,
            naver.maps.Service.OrderType.ROAD_ADDR
        ].join(',')
    }, function(status, response) {
        if (status === naver.maps.Service.Status.ERROR) {
            return alert('Something Wrong!');
        }

        var items = response.v2.results,
            address = '',
            htmlAddresses = [];

        for (var i = 0, ii = items.length, item, addrType; i < ii; i++) {
            item = items[i];    
            address = makeAddress(item) || '';
            addrType = item.name === 'roadaddr' ? '[도로명 주소]' : '[지번 주소]';
            htmlAddresses.push(addrType + ' ' + address);
        }
        let userCount = document.getElementById('user_count').textContent;
        let infoWindowContainer = document.createElement('div');

        let infoWindowTitle = document.createElement('h4');
        infoWindowTitle.textContent = '검색 좌표';
        infoWindowContainer.appendChild(infoWindowTitle);

        let infoWindowUserButtons = document.createElement('div');
        for(let  i = 0; i < userCount; i++) {
            let btn = document.createElement('button');
            btn.textContent = (i+1);
            btn.id = 'btn' + (i+1);
            btn.addEventListener('click', () => {
                saveAddress((i+1), latlng);
            });
            infoWindowUserButtons.appendChild(btn);
        }
        infoWindowContainer.appendChild(infoWindowUserButtons);

        let infoWindowAddress = document.createElement('div');
        infoWindowAddress.id = 'address_div';
        infoWindowAddress.innerText = ([
            htmlAddresses.join('\n')
        ].join('\n'));
        infoWindowContainer.appendChild(infoWindowAddress);
        infoWindow.setContent(infoWindowContainer);
        infoWindow.open(map, latlng);
    });
}

function searchAddressToCoordinate(address) {
    naver.maps.Service.geocode({
        query: address
    }, function(status, response) {
        if (status === naver.maps.Service.Status.ERROR) {
            return alert('Something Wrong!');
        }

        if (response.v2.meta.totalCount === 0) {
            return alert('totalCount' + response.v2.meta.totalCount);
        }

        var htmlAddresses = [],
            item = response.v2.addresses[0],
            point = new naver.maps.Point(item.x, item.y);

        if (item.roadAddress) {
            htmlAddresses.push('[도로명 주소] ' + item.roadAddress);
        }

        if (item.jibunAddress) {
            htmlAddresses.push('[지번 주소] ' + item.jibunAddress);
        }

        if (item.englishAddress) {
            htmlAddresses.push('[영문명 주소] ' + item.englishAddress);
        }

        infoWindow.setContent([
            '<div style="padding:10px;min-width:200px;line-height:150%;">',
            '<h4 style="margin-top:5px;">검색 주소 : ' + address + '</h4><br />',
            htmlAddresses.join('<br />'),
            '</div>'
        ].join('\n'));
        
        map.setCenter(point);
        infoWindow.open(map, point);
    });
}

function initGeocoder() {
    map.addListener('click', function(e) {
        searchCoordinateToAddress(e.coord);
    });

    let address = document.getElementById('address_input');
    address.addEventListener('keydown', function(e) {
        var keyCode = e.which;

        if (keyCode === 13) { // Enter Key
            searchAddressToCoordinate(address.value);
        }
    });

    let searchAddressBtn = document.getElementById('search_address');
    searchAddressBtn.addEventListener('submit', function(e) {
        e.preventDefault();
        searchAddressToCoordinate(address.value);
    });
    //searchAddressToCoordinate('정자동 178-1');
}

function makeAddress(item) {
    if (!item) {
        return;
    }
    var name = item.name,
        region = item.region,
        land = item.land,
        isRoadAddress = name === 'roadaddr';

    var sido = '', sigugun = '', dongmyun = '', ri = '', rest = '';

    if (hasArea(region.area1)) {
        sido = region.area1.name;
    }

    if (hasArea(region.area2)) {
        sigugun = region.area2.name;
    }

    if (hasArea(region.area3)) {
        dongmyun = region.area3.name;
    }

    if (hasArea(region.area4)) {
        ri = region.area4.name;
    }

    if (land) {
        if (hasData(land.number1)) {
            if (hasData(land.type) && land.type === '2') {
                rest += '산';
            }

            rest += land.number1;

            if (hasData(land.number2)) {
                rest += ('-' + land.number2);
            }
        }

        if (isRoadAddress === true) {
            if (checkLastString(dongmyun, '면')) {
                ri = land.name;
            } else {
                dongmyun = land.name;
                ri = '';
            }

            if (hasAddition(land.addition0)) {
                rest += ' ' + land.addition0.value;
            }
        }
    }

    return [sido, sigugun, dongmyun, ri, rest].join(' ');
}

function hasArea(area) {
    return !!(area && area.name && area.name !== '');
}

function hasData(data) {
    return !!(data && data !== '');
}

function checkLastString(word, lastString) {
    return new RegExp(lastString + '$').test(word);
}

function hasAddition(addition) {
    return !!(addition && addition.value);
}

naver.maps.onJSContentLoaded = initGeocoder;