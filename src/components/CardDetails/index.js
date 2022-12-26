import {Link} from 'react-router-dom'
import {AiFillStar} from 'react-icons/ai'

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
      <div className="title">
        <Link to={`/jobs/${id}`}>
          <img src={imageUrl} alt="website logo" className="websiteLogo" />
        </Link>
        <div>
          <h1>{title}</h1>
          <div className="title">
            <AiFillStar className="star" />
            <p>{rating}</p>
          </div>
        </div>
      </div>

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
