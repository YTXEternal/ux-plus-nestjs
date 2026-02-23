export const objFor = <T extends Record<string,any>>(obj:T,cb:(key:string,el:T[keyof T])=>void) =>{
    const keys = Object.keys(obj);
    if(keys.length === 0) return;
    keys.forEach(key=>{
        const el = obj[key];
        cb(key,el);
    })
}