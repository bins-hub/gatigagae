// A local, optional pet-search preference; never sent to the site owner.
// Keep schema small and guard against corrupted/stale browser values.
export function normalizePetProfile(input) {
 if (!input || typeof input !== 'object' || Array.isArray(input)) return null;
 const weight=Number(input.weight), dogs=Number(input.dogs);
 const breed=typeof input.breed==='string'?input.breed.trim():'';
 if (!Number.isFinite(weight)||weight<0.1||weight>150||!Number.isInteger(dogs)||dogs<1||dogs>10||breed.length>50) return null;
 return {weight,dogs,breed};
}
export function encodePetProfile(input) {
 const profile=normalizePetProfile(input);
 if (!profile) throw Error('반려견 정보를 확인해 주세요');
 return JSON.stringify({version:1,...profile});
}
export function decodePetProfile(raw) {
 if (typeof raw!=='string'||raw.length>500) return null;
 try {
  const parsed=JSON.parse(raw);
  if (!parsed||parsed.version!==1) return null;
  return normalizePetProfile(parsed);
 } catch {return null;}
}
