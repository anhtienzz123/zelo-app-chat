import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';

const AdminProtectedRoute = ({ component: Component, ...rest }) => {
    const { user } = useSelector((state) => state.global);

    return (
        <Route
            {...rest}
            render={(props) => {
                if (user && user.isAdmin) return <Component {...props} />;

                return (
                    <Redirect
                        to={{
                            pathname: '/account/login',
                            state: {
                                from: props.location,
                            },
                        }}
                    />
                );
            }}
        />
    );
};

export default AdminProtectedRoute;
