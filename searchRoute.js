// URL links are navigation hints, not proof of pet admission.
const REGION_BY_SLUG=Object.freeze({hanam:'하남',namyangju:'남양주',yangpyeong:'양평'});
export function parseSearchRoute(search) {
 if(typeof search!=='string'||search.length>512)return null;
 try {
  const params=new URLSearchParams(search.startsWith('?')?search.slice(1):search);
  const region=REGION_BY_SLUG[params.get('region')];
  const intent=params.get('intent');
  if(!region||intent!=='cafes')return null;
  return {region,intent};
 }catch{return null}
}
export function regionSearchHref(slug){
 if(!Object.prototype.hasOwnProperty.call(REGION_BY_SLUG,slug))throw Error('Unsupported region slug');
 return '../../?region='+encodeURIComponent(slug)+'&intent=cafes#results-title';
}
