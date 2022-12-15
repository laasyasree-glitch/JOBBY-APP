const SimilarJobsSection = props => {
  const {details} = props
  const {
    title,
    companyLogoUrl,
    companyWebsiteUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
  } = details
  return (
    <li>
      <img src={companyLogoUrl} alt="similar job company logo" />
      <h1>{title}</h1>
      <p>{employmentType}</p>
      <h1>Description</h1>
      <p>{jobDescription}</p>
      <p>{location}</p>
      <p>{packagePerAnnum}</p>
      <p>{rating}</p>
      <a href={companyWebsiteUrl}>Visit</a>
    </li>
  )
}

export default SimilarJobsSection
