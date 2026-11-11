const CATEGORIES=new Set(['it','manufacturing','skilled_trade','apprenticeship','retail','education','healthcare','accounting','general','other']);
const TYPES=new Set(['full_time','part_time','contract','internship']);
export function validateJobInput(d){
 const title=String(d?.title??'').trim(),company=String(d?.company??'').trim(),location=String(d?.location??'').trim();
 if(!title||title.length>150||!company||company.length>150||!location||location.length>150)return 'Enter a valid job title, company and location (maximum 150 characters each).';
 if(!['hr','referral','known_source'].includes(d?.source_type))return 'Select a valid vacancy source.';
 if(d?.category&&!CATEGORIES.has(d.category))return 'Select a valid job category.';
 if(d?.employment_type&&!TYPES.has(d.employment_type))return 'Select a valid employment type.';
 const min=d?.min_experience==null||d.min_experience===''?0:Number(d.min_experience),max=d?.max_experience==null||d.max_experience===''?null:Number(d.max_experience);
 if(!Number.isInteger(min)||min<0||min>60)return 'Minimum experience must be between 0 and 60 years.';
 if(max!==null&&(!Number.isInteger(max)||max<min||max>60))return 'Maximum experience must be at least the minimum and no more than 60 years.';
 if(d?.apply_by&&!/^\d{4}-\d{2}-\d{2}$/.test(d.apply_by))return 'Apply-by date must be a valid calendar date.';
 if(String(d?.skills??'').length>500||String(d?.description??'').length>8000||String(d?.salary_text??'').length>120)return 'One or more job details exceed the allowed length.';
 return null;
}
