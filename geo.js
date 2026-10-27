// Geolocation preparation. Never infer coordinates from an unverified address.
const rad=degrees=>degrees*Math.PI/180;
export function validCoordinates(x){
 return !!x && typeof x.lat==='number' && Number.isFinite(x.lat) && x.lat>=-90 && x.lat<=90
   && typeof x.lng==='number' && Number.isFinite(x.lng) && x.lng>=-180 && x.lng<=180;
}
export function distanceKm(a,b){
 if(!validCoordinates(a)||!validCoordinates(b))throw Error('Valid geographical coordinates required');
 const dLat=rad(b.lat-a.lat),dLng=rad(b.lng-a.lng);
 const h=Math.sin(dLat/2)**2+Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(dLng/2)**2;
 return 6371.0088*2*Math.asin(Math.sqrt(Math.max(0,Math.min(1,h))));
}
export function verifiedPoint(venue){
 const x=venue?.geolocation;
 if(!validCoordinates(x)||!x.sourceUrl?.startsWith('https://')||! /^\d{4}-\d{2}-\d{2}$/.test(x.verifiedOn||''))return null;
 return {lat:x.lat,lng:x.lng};
}
export function sortByVerifiedDistance(places,userLocation){
 if(!validCoordinates(userLocation))throw Error('Location permission or valid coordinates are needed');
 return places.map(place=>({place,point:verifiedPoint(place)}))
   .filter(x=>x.point!==null)
   .map(x=>({place:x.place,distanceKm:distanceKm(userLocation,x.point)}))
   .sort((a,b)=>a.distanceKm-b.distanceKm || a.place.id.localeCompare(b.place.id));
}
export function geoCoverage(places){
 const matched=places.filter(x=>verifiedPoint(x));
 return {candidates:places.length,ready:matched.length,pending:places.length-matched.length,
   needsSourceVerification:places.filter(x=>!verifiedPoint(x)).map(x=>x.id)};
}
