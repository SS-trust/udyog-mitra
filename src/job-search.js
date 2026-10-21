// Deterministic, zero-cost job ranking over UdyogMitra's verified internal postings.
// Results never pretend that externally advertised vacancies are locally available.
const synonyms={
 developer:['programmer','software','engineer','coding','web','backend','frontend'],
 engineer:['engineering','developer','technical'],
 accountant:['accounts','accounting','tally','finance','bookkeeper'],
 accounting:['accountant','accounts','tally','finance'],
 teacher:['teaching','education','faculty','tutor'],
 driver:['driving','delivery','transport','logistics'],
 electrician:['electrical','wireman','maintenance'],
 fitter:['mechanic','technician','iti'],
 nurse:['nursing','healthcare','hospital'],
 fresher:['trainee','intern','apprentice','entry','junior'],
 sales:['marketing','business','development','retail'],
 hr:['human','resources','recruiter','recruitment'],
 data:['analytics','analyst','excel','sql'],
 remote:['work from home','wfh','hybrid'],
};
export function terms(input){return [...new Set(String(input||'').toLowerCase().match(/[\p{L}\p{N}+#.]+/gu)||[])].filter(x=>x.length>1).slice(0,16)}
export function rankJob(job,query){
 const words=terms(query);if(!words.length)return {score:0,matches:[]};
 const title=String(job.title||'').toLowerCase(),skills=String(job.skills||'').toLowerCase(),desc=String(job.description||'').toLowerCase(),company=String(job.company||'').toLowerCase(),location=String(job.location||'').toLowerCase(),category=String(job.category||'').toLowerCase();
 let score=0;const matches=[];
 for(const word of words){
   const related=[word,...(synonyms[word]||[])];
   const exact=(s)=>new RegExp('(^|[^\\p{L}\\p{N}])'+word.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?=$|[^\\p{L}\\p{N}])','iu').test(s);
   let points=0;
   if(exact(title))points=15;
   else if(exact(skills))points=12;
   else if(exact(category))points=9;
   else if(exact(location))points=8;
   else if(exact(company))points=6;
   else if(exact(desc))points=4;
   else if(related.slice(1).some(x=>[title,skills,category,desc].some(s=>s.includes(x))))points=3;
   if(points){score+=points;matches.push(word)}
 }
 // Require evidence from at least one actual query term/synonym; rank stronger matches first.
 if(words.length>1&&matches.length===words.length)score+=12;
 if(words.length>1&&matches.length===1)score=Math.max(1,score-2);
 return {score,matches}
}
export function searchAndRank(jobs,query,limit=100){
 const q=String(query||'').trim();
 if(!q)return [...jobs].sort((a,b)=>String(b.created_at||'').localeCompare(String(a.created_at||''))).slice(0,limit).map(j=>({...j,relevance_score:null}));
 return jobs.map(j=>({...j,...(()=>{const r=rankJob(j,q);return {relevance_score:r.score,matched_terms:r.matches}})()})).filter(j=>j.relevance_score>0).sort((a,b)=>b.relevance_score-a.relevance_score||String(b.created_at||'').localeCompare(String(a.created_at||''))).slice(0,limit)
}
