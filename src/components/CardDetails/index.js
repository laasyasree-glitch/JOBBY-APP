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
      <Link to={`/jobs/${id}`} className="link">
        <div className="title">
          <div>
            <img src={imageUrl} alt="website logo" className="websiteLogo" />
          </div>

          <div>
            <h1 className="heading">{title}</h1>
            <div className="star-rating-container">
              <AiFillStar fill="#fbbf24" />
              <p className="rating-text">{rating}</p>
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
      </Link>
    </div>
  )
}

export default CardDetails
