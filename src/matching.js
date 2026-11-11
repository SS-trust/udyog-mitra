// Transparent, deterministic matching. Scores are guidance, not an eligibility decision.
const synonyms={
 developer:['programmer','software','coding','web developer'],programmer:['developer','software','coding'],
 accountant:['accounting','accounts','tally','bookkeeping'],accounting:['accountant','accounts','tally'],
 teacher:['teaching','educator','faculty','tutor'],driver:['driving','delivery','transport'],
 electrician:['electrical','wireman','maintenance'],mechanic:['technician','fitter'],
 fresher:['trainee','intern','apprentice','entry level'],sales:['marketing','retail','business development'],
 data:['analytics','analyst','sql','excel'],hr:['human resources','recruiter','recruitment'],
};
export function tokens(value){return [...new Set(String(value||'').toLocaleLowerCase().match(/[\p{L}\p{M}\p{N}+#.]+/gu)||[])].filter(w=>w.length>1)}
const expand=values=>{const base=tokens(values);return [...new Set([...base,...base.flatMap(t=>synonyms[t]||[])])]};
export function scoreMatch(job,candidate){
 const wanted=expand([candidate.skills,candidate.desired_roles,candidate.qualification].join(' '));
 const skills=tokens(candidate.skills),roles=tokens(candidate.desired_roles),qualification=tokens(candidate.qualification);
 const offered=expand([job.title,job.skills,job.description].join(' '));
 const overlap=skills.filter(x=>offered.includes(x));
 const roleOverlap=roles.filter(x=>offered.includes(x));
 const qualificationOverlap=qualification.filter(x=>offered.includes(x));
 const skillScore=skills.length?Math.round(50*overlap.length/skills.length):0;
 const roleScore=roles.length?Math.round(25*roleOverlap.length/roles.length):0;
 const qualificationScore=qualification.length?Math.round(10*qualificationOverlap.length/qualification.length):0;
 const loc=String(candidate.preferred_location||'').toLowerCase().trim(),place=String(job.location||'').toLowerCase();
 const locationMatch=!!(loc&&(place.includes(loc)||loc.includes(place)||place.includes('remote')));
 const exp=Number(candidate.experience_years||0),min=Number(job.min_experience||0),max=job.max_experience==null?Infinity:Number(job.max_experience);
 const experienceMatch=exp>=min&&exp<=max;
 const score=Math.max(0,Math.min(100,skillScore+roleScore+qualificationScore+(locationMatch?10:0)+(experienceMatch?5:0)));
 return {score,matched_skills:[...new Set([...overlap,...roleOverlap])],location_match:locationMatch,experience_match:experienceMatch};
}
export function rankedJobs(jobs,candidate,limit=15){return jobs.map(j=>({...j,match:scoreMatch(j,candidate)})).sort((a,b)=>b.match.score-a.match.score||String(b.created_at||'').localeCompare(String(a.created_at||''))).slice(0,limit)}
