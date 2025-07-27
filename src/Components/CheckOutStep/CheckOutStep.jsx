/* eslint-disable react/prop-types */
import { Typography, Stepper, StepLabel, Step } from '@mui/material';
import LocalShipping from '@mui/icons-material/LocalShipping';
import LibraryAddCheck from '@mui/icons-material/LibraryAddCheck';
import AccountBalance from '@mui/icons-material/AccountBalance';
import './CheckOutStep.css'

const CheckOutStep = ({ activeStep }) => {
    const steps = [
        {
            label: <Typography style={{fontSize:"14px"}}>Shipping Details</Typography>,
            icon: <LocalShipping style={{fontSize:"24px"}}/>
        },
        {
            label: <Typography style={{fontSize:"14px"}}>Confirm Order</Typography>,
            icon: <LibraryAddCheck style={{fontSize:"24px"}}/>
        },
        {
            label: <Typography style={{fontSize:"14px"}}>Payment</Typography>,
            icon: <AccountBalance  style={{fontSize:"24px"}}/>
        },
    ]
    return (
        <div className="checkout-stepper-wrapper">
            <Stepper alternativeLabel activeStep={activeStep}>
            {steps.map((item, index) => (
                <Step key={index} active={activeStep === index} completed={activeStep >= index}>
                <StepLabel
                    icon={item.icon}
                    style={{ color: activeStep >= index ? "#240750" : "black" }}
                >
                    {item.label}
                </StepLabel>
                </Step>
            ))}
            </Stepper>
        </div>
    )
}

export default CheckOutStep
