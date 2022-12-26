import {Link} from 'react-router-dom'
import './index.css'

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
    <div className="eachJob">
      <Link to={`/jobs/${id}`} className="title">
        <img src={imageUrl} alt="website logo" />
        <h1>{title}</h1>
      </Link>
      <p>{rating}</p>
      <div className="sub-alignment">
        <p>{packagePerAnnum}</p>
        <p>{location}</p>
        <p>{employmentType}</p>
      </div>
      <hr />

      <h1>Description</h1>
      <p>{description}</p>
    </div>
  )
}

export default CardDetails
