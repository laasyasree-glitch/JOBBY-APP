import {Link} from 'react-router-dom'
import './index.css'
import Header from '../Header'

const HomeRoute = () => (
  <div>
    <Header />
    <div className="bg">
      <h1 className="heading">Find The Job That Fits Your Life</h1>
      <p className="para">
        Millions of people are searching for jobs, salary information, company
        reviews. Find the job that fits your abilities and potential.
      </p>
      <Link to="/jobs" className="find-jobs-button">
        <button className="back" type="button">
          Find Jobs
        </button>
      </Link>
    </div>
  </div>
)

export default HomeRoute
