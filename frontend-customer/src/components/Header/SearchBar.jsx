import React from 'react'
import {Form, InputGroup, Button, Col, Row} from 'react-bootstrap'

function SearchBar() {
    return (
        <Form className='col-10 col-sm-6 '>
            <InputGroup className='p-1 rounded-3 search_input_group'>
                <Form.Control
                    placeholder="Search here"
                />
                <Button variant="dark" className='btn_main_dark'>
                    <i className="bi bi-search"></i>
                </Button>
            </InputGroup>
        </Form>
    )
}

export default SearchBar;