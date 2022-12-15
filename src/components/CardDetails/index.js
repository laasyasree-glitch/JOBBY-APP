import {Link} from 'react-router-dom'

const CardDetails = props => {
  const {itemDetails} = props
  const {
    id,
    imageUrl,
    title,
    packagePerAnnum,
    location,
    rating,
    employmentType,
    description,
  } = itemDetails
  return (
    <Link to={`/jobs/${id}`}>
      <li>
        <img src={imageUrl} alt="website logo" />
        <h1>{title}</h1>
        <p>{packagePerAnnum}</p>
        <p>{location}</p>
        <p>{rating}</p>
        <p>{employmentType}</p>
        <h1>Description</h1>
        <p>{description}</p>
      </li>
    </Link>
  )
}

export default CardDetails
