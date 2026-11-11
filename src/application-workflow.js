// Explicit, auditable application state machine. Transitions are intentionally one-way.
export const APPLICATION_TRANSITIONS=Object.freeze({
 submitted:['acknowledged','referred','rejected','withdrawn'],
 acknowledged:['referred','interview','rejected','withdrawn'],
 referred:['interview','rejected','withdrawn'],
 interview:['offered','rejected','withdrawn'],
 offered:['hired','rejected','withdrawn'],
 hired:[],rejected:[],withdrawn:[]
});
export function canTransitionApplication(from,to,actor){
 if(!Object.hasOwn(APPLICATION_TRANSITIONS,from)||!APPLICATION_TRANSITIONS[from].includes(to))return false;
 if(to==='withdrawn')return actor==='submitter';
 return actor==='poster';
}
