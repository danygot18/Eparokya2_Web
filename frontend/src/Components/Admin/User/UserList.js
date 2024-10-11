import React, { Fragment, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { Table } from '@mui/material';
import { MDBDataTable } from 'mdbreact';
import MetaData from '../../Layout/MetaData';
import Loader from '../../Layout/Loader';
import SideBar from '../SideBar';

import axios from 'axios';
import { getToken, successMsg, errMsg } from '../../../Utils/helpers';
import { Toast } from 'react-bootstrap';

// Importing icons from react-icons
import { FaEdit } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa';

const UsersList = () => {         
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [allUsers, setAllUsers] = useState([]);
    const [isDeleted, setIsDeleted] = useState('');
    let navigate = useNavigate();
    
    const config = {
        headers: {
            withCredentials: true
        }
    };

    const listUsers = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/admin/users`, config);
            setAllUsers(data.users);
            setLoading(false);
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    const deleteUser = async (id) => {
        try {
            const { data } = await axios.delete(`${process.env.REACT_APP_API}/api/v1/admin/user/${id}`, config);
            setIsDeleted(data.success);
            setLoading(false);
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    useEffect(() => {
        listUsers();
        if (error) {
            errMsg(error);
            setError('');
        }
        if (isDeleted) {
            successMsg('User deleted successfully');
            navigate('/admin/users');
        }
    }, [error, isDeleted]);

    const deleteUserHandler = (id) => {
       deleteUser(id);
    };

    const setUsers = () => {
        const data = {
            columns: [
                {
                   label: 'User ID',
                    field: 'id',
                    sort: 'asc'
                },
                {
                    label: 'Name',
                    field: 'name',
                    sort: 'asc'
                },
                {
                    label: 'Email',
                    field: 'email',
                    sort: 'asc'
                },
                {
                    label: 'Role',
                    field: 'role',
                    sort: 'asc'
                },
                {
                    label: 'Actions',
                    field: 'actions',
                },
            ],
            rows: []
        };
        allUsers.forEach(user => {
            data.rows.push({
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                actions: <Fragment>
                    <Link to={`/admin/user/${user._id}`} className="btn btn-primary py-1 px-2 mr-5">
                        <FaEdit />
                    </Link>
                    <FaTrash 
                        className="btn btn-danger py-1 px-2 ml-2 mr-5" 
                        onClick={() => deleteUserHandler(user._id)} 
                        style={{ cursor: 'pointer' }}
                    />
                </Fragment>
            });
        });
        return data;
    };

    return (
        <Fragment>
            <MetaData title={'All Users'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <SideBar />
                </div>
                <div className="col-12 col-md-10">
                    <Fragment>
                        <h1 className="my-5">All Users</h1>
                        {loading ? <Loader /> : (
                            <Table
                                component={MDBDataTable}
                                data={setUsers()}
                                className="px-3"
                                bordered
                                striped
                                hover
                            />
                        )}
                    </Fragment>
                </div>
            </div>
        </Fragment>
    );
};

export default UsersList;
