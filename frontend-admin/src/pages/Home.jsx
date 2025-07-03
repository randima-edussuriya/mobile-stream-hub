import React from 'react'
import Chart1 from '../components/Chart1'

function Home() {
    return (
        <div>
            <div className='container-fluid'>
                <div className='row g-3 my-2'>
                    <div className='col-12 col-sm-6 col-md-4 col-lg-3  p-1'>
                        <div className='p-3 bg-success-subtle shadow-sm d-flex justify-content-around align-items-center rounded'>
                            <div>
                                <h3 className='fs-3'>0</h3>
                                <span className='fs-5'>Customers</span>
                            </div>
                            <i className="bi bi-people p-3 fs-1"></i>
                        </div>
                    </div>
                    <div className='col-12 col-sm-6 col-md-4 col-lg-3  p-1'>
                        <div className='p-3 bg-danger-subtle shadow-sm d-flex justify-content-around align-items-center rounded'>
                            <div>
                                <h3 className='fs-3'>0</h3>
                                <span className='fs-5'>Products</span>
                            </div>
                            <i className="bi bi-diagram-3 p-3 fs-1"></i>
                        </div>
                    </div>
                    <div className='col-12 col-sm-6 col-md-4 col-lg-3  p-1'>
                        <div className='p-3 bg-info-subtle shadow-sm d-flex justify-content-around align-items-center rounded'>
                            <div>
                                <h3 className='fs-3'>0</h3>
                                <span className='fs-5'>Categories</span>
                            </div>
                            <i className="bi bi-bookmarks p-3 fs-1"></i>
                        </div>
                    </div>
                    <div className='col-12 col-sm-6 col-md-4 col-lg-3  p-1'>
                        <div className='p-3 bg-white shadow-sm d-flex justify-content-around align-items-center rounded'>
                            <div>
                                <h3 className='fs-3'>0</h3>
                                <span className='fs-5'>Orders</span>
                            </div>
                            <i className="bi bi-border-all p-3 fs-1"></i>
                        </div>
                    </div>
                </div>

                <div className='text-white'>
                    <Chart1 />
                </div>
            </div>

        </div>
    )
}

export default Home