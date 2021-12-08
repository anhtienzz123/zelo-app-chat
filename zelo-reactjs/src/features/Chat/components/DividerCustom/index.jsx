import React from 'react';
import PropTypes from 'prop-types';
import './style.scss';

DividerCustom.propTypes = {
    dateString: PropTypes.object,
};

function DividerCustom({ dateString }) {


    const date = new Date(dateString);
    const currentDate = new Date();

    const checkCurrentDate = date.getDate() === currentDate.getDate();



    return (
        <div id='divider-custom'>
            <div className='divider-custom_bar'></div>
            <div className='divider-custom_info'>
                <div className='divider-custom_info--time'>
                    <span>


                        {`0${dateString.getHours() + 6}`.slice(-2)}:
                        {`0${dateString.getMinutes()}`.slice(-2)}
                    </span>
                </div>

                <div className='divider-custom_info--date'>
                    <span>
                        {
                            checkCurrentDate ? 'Hôm nay' :

                                <span>
                                    {`0${dateString.getDate()}`.slice(-2)}/
                                    {`0${dateString.getMonth()}`.slice(-2)}/
                                    {dateString.getFullYear()}
                                </span>
                        }

                    </span>
                </div>
            </div>
            <div className='divider-custom_bar'></div>
        </div>
    );
}

export default DividerCustom;
