import React from 'react'
import logo from '../../assets/icons/logo.png'
import { Link } from 'react-router-dom'
import './Sidebar.css'

function Sidebar() {
    return (
        <>
            <div className='p-2'>
                <div className='m-2'>
                    <Link to={'/home'}>
                        <img
                            src={logo}
                            alt='logo'
                            className='img-fluid'
                        />
                    </Link>
                </div>
                <hr className='text-dark' />

                <div className='list-group list-group-flush rounded'>
                    <Link to={'/home'} className='list-group-item py-2'>
                        <i className="bi bi-person-gear fs-5 me-3"></i>
                        <span>Staff Management</span>
                    </Link>
                    <Link to={'/home'} className='list-group-item py-2'>
                        <i className="bi bi-people fs-5 me-3"></i>
                        <span>Customer Management</span>
                    </Link>
                    <Link to={'/home'} className='list-group-item py-2'>
                        <i className="bi bi-bookmarks fs-5 me-3"></i>
                        <span>Category Management</span>
                    </Link>
                    <Link to={'/home'} className='list-group-item py-2'>
                        <i className="bi bi-diagram-3 fs-5 me-3"></i>
                        <span>Item Management</span>
                    </Link>
                    <Link to={'/home'} className='list-group-item py-2'>
                        <i className="bi bi-border-all fs-5 me-3"></i>
                        <span>Order Management</span>
                    </Link>
                    <Link to={'/home'} className='list-group-item py-2'>
                        <i className="bi bi-truck fs-5 me-3"></i>
                        <span>Delivery Management</span>
                    </Link>
                    <Link to={'/home'} className='list-group-item py-2'>
                        <i className="bi bi-sliders2-vertical fs-5 me-3"></i>
                        <span>Repair Management</span>
                    </Link>
                    <Link to={'/home'} className='list-group-item py-2'>
                        <i className="bi bi-arrow-clockwise fs-5 me-3"></i>
                        <span>Reorder Management</span>
                    </Link>
                    <Link to={'/home'} className='list-group-item py-2'>
                        <i className="bi bi-calendar-day fs-5 me-3"></i>
                        <span>Day off Management</span>
                    </Link>
                    <Link to={'/home'} className='list-group-item py-2'>
                        <i className="bi bi-cursor fs-5 me-3"></i>
                        <span>Loyalty Program Management</span>
                    </Link>
                    <Link to={'/home'} className='list-group-item py-2'>
                        <i className="bi bi-star fs-5 me-3"></i>
                        <span>Feedback and rating Management</span>
                    </Link>
                    <Link to={'/home'} className='list-group-item py-2'>
                        <i className="bi bi-telephone-forward fs-5 me-3"></i>
                        <span>Customer Support Management</span>
                    </Link>
                    <Link to={'/home'} className='list-group-item py-2'>
                        <i className="bi bi-flag fs-5 me-3"></i>
                        <span>Reports</span>
                    </Link>
                </div>
            </div>
        </>
    )
}

export default Sidebar