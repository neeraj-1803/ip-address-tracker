import React, { useEffect, useState } from 'react'
import arrowImg from '../images/icon-arrow.svg'
import locImg from '../images/icon-location.svg'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import L from 'leaflet';

const Header = () => {
    const [map, setMap] = useState(null);
    const [data, setData] = useState("");
    const [ip, setIp] = useState("");
    const [loc, setLoc] = useState("");
    const [time, setTime] = useState("");
    const [isp, setIsp] = useState("");
    const [latLong, setLatLong] = useState([51.5074, 0.1278]);
    useEffect(()=>{
        const getDataToDisplay = async() => {
            let ipAddressResult;
            if(data === "")
                ipAddressResult = await fetch('https://ipgeolocation.abstractapi.com/v1/?api_key=87f6ca6af958452b9eef5bf452915965&ip_address=');
            else
                ipAddressResult = await fetch(`https://ipgeolocation.abstractapi.com/v1/?api_key=87f6ca6af958452b9eef5bf452915965&ip_address=${data}`);
    
            let resp = await ipAddressResult.json();
            console.log(resp)
            if(resp.hasOwnProperty('error')){
                alert(resp.error.message);
            }else{
                setLoc(`${(resp.city!==null)? resp.city: ''}, ${(resp.region !== null)? resp.region : ''}, ${(resp.postal_code !== null)? resp.postal_code : ''} ${resp.flag.emoji}`);
                setIp(resp.ip_address);
                setTime(`${resp.timezone.abbreviation}, ${resp.timezone.name}, ${resp.timezone.is_dst? '-': '+'} ${resp.timezone.gmt_offset}:00`);
                setIsp(`${resp.connection.organization_name}`);
                let latLo = [];
                latLo.push(resp.latitude);
                latLo.push(resp.longitude);
                setLatLong(latLo);
            }
        }
        getDataToDisplay();
    },[data]);

    useEffect(() => {
        if(map) map.flyTo(latLong, 14, {
            duration: 2
        });
    }, [map])

    const getData = () => {
        let text = document.getElementById("ipaddr").value;
        if(text.length >= 7 && text.replace(/[^.]/g, "").length === 3){
            // console.log("text is"+text);
            setData(text);
            map.flyTo(latLong, 14, {
                duration: 2
            });
        }else{
            console.log("incorrect");
        }
    }

    const markerIcon = L.icon({
        iconUrl: locImg,
        shadowUrl: '',
        iconSize: [46, 46], 
        shadowSize: [40, 40]
    });

    const getLatLngBounds = () => {
        return L.latLngBounds(latLong);
    }

    return (
        <div className="header">
            <div className="backgr"></div>
            <div className="header-main">
                <div className="search">
                    <h1>IP Address Tracker</h1>
                    <div className="form-ele">
                        <input type="text" placeholder="Search for any IP address or domain" id="ipaddr"/>
                        <div className="button" onClick={(e)=>getData()}>
                            <img src={arrowImg} alt="arrow button" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="ip-addr-hdr">
                    <div className="ip-addr">
                    <div className="row">
                        <h3>Ip address</h3>
                        <h1>{ip}</h1>
                    </div>
                    <div className="row">
                        <h3>Location</h3>
                        <h1>{loc}</h1>
                    </div>
                    <div className="row">
                        <h3>Timezone</h3>
                        <h1>{time}</h1>
                    </div>
                    <div className="row2">
                        <h3>ISP</h3>
                        <h1>{isp}</h1>
                    </div>
                </div>
            </div>
            <div className="maps">
                <MapContainer whenCreated={map => setMap(map)} center={latLong} bounds={getLatLngBounds()} flyTo={()=>{return (latLong, 14, {duration: 2})}} zoom={13} style={{height: '100%'}}>
                    <TileLayer
                        attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                        url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
                    />
                    <Marker position={latLong} icon={markerIcon}>
                        <Popup>
                            {loc}
                        </Popup>
                    </Marker>
                </MapContainer>
            </div>
        </div>
    )
}

export default Header
