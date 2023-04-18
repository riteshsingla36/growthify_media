import React, { useEffect, useState } from 'react'
import { Dropdown } from 'primereact/dropdown';
import axios from 'axios';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { InputMask } from 'primereact/inputmask';
import { ToggleButton } from 'primereact/togglebutton';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';


const CreateTask = (props) => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState(null);
    const [address, setAddress] = useState("");
    const [gst, setGst] = useState("");
    const [projects, setProjects] = useState("");
    const [billingPhone, setBillingPhone] = useState("");
    const [stateCode, setStateCode] = useState("");
    const [brandName, setBrandName] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [userId, setUserId] = useState("");
    const [selectedUserType, setSelectedUserType] = useState(null);
    const [status, setStatus] = useState(true);
    const userTypes = [{
        "name": "Employee"
    }, {
        "name": "Client"
    }]


    const createUser = async (e) => {
        e.preventDefault();
        try{
            const res = await axios.post("/api/create_user", {
                name,
                email,
                password,
                userId,
                phoneNo: phone,
                userType: selectedUserType.name,
                status: status ? "ACTIVE" : "INACTIVE",
                role,
                projects,
                billingAddress: address,
                GSTIN: gst,
                billingPhoneNo: billingPhone,
                brandName: brandName,
                stateCode: stateCode
            });
            var channelName = `${name}_${userId}`;
            channelName = channelName.replace(/ /g, '_');
            channelName = channelName.replace(/-/g, '_');
            channelName = channelName.toLowerCase();
            channelName = channelName.replace(/\./g, '');
            const channelId = await axios.post("/api/create_slack_channel", {channelName});
            const employees = await axios.get("/api/get_users?userType=Employee");
            let slackUserIds = [];

            for(let employee of employees.data){
                const userId = await axios.get(`/api/get_slack_userid?email=${employee.email}`);
                slackUserIds.push(userId.data.userId);
            }
            await axios.post("/api/invite_users_tochannel", {channelId: channelId.data.channelId, userIds: slackUserIds});

            if(res.status === 200){
                alert("User created successfully");
                setName("");
                setEmail("");
                setPhone(null);
                setSelectedUserType(null);
                setRole("");
                setPassword("");
                setUserId("");
                setProjects("");
                setStatus(true);
            }else {
                alert("error while creating user");
                setName("");
                setEmail("");
                setPhone(null);
                setSelectedUserType(null);
                setRole("");
                setPassword("");
                setUserId("");
                setProjects("");
                setStatus(true);
            }
        }catch(e){
            console.log(e.message);
        }
    }

    return (
        <>
            <h1 className='w-full m-auto text-center !bg-[#304562] text-white !pt-5'>CREATE USER</h1>
            <div className='w-full min-h-[60vh] flex justify-center items-center !bg-[#304562]'>
                <form method='POST' onSubmit={createUser}>
                    <div className="card !grid border-0 grid-cols-2 gap-4 !bg-[#304562]">
                        <span className="p-float-label">
                            <InputText id="name" value={name} onChange={(e) => setName(e.target.value)} />
                            <label htmlFor="name">Name</label>
                        </span>

                        <span className="p-float-label">
                            <InputText id="email" type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                            <label htmlFor="email">Email</label>
                        </span>

                        <div className="card flex justify-content-center">
                            <InputMask value={phone} onChange={(e) => setPhone(e.target.value)} mask="9999999999" placeholder="Phone No." />
                        </div>

                        <div className="card flex justify-content-center">
                            <InputMask value={userId} onChange={(e) => setUserId(e.target.value)} mask="a**-999" placeholder="User Id" />
                        </div>

                        <Password value={password} placeholder='Password' onChange={(e) => setPassword(e.target.value)} toggleMask />

                        <span className="p-float-label">
                            <InputText id="role" value={role} onChange={(e) => setRole(e.target.value)} />
                            <label htmlFor="role">Role</label>
                        </span>

                        <span className="p-float-label">
                            <InputText id="projects" value={projects} onChange={(e) => setProjects(e.target.value)} />
                            <label htmlFor="projects">Projects</label>
                        </span>

                        <Dropdown value={selectedUserType} onChange={(e) => setSelectedUserType(e.value)} options={userTypes} optionLabel="name"
                            placeholder="Select User Type" className="w-full md:w-14rem" />

                        <span className="p-float-label">
                            <InputText id="billaddress" value={address} onChange={(e) => setAddress(e.target.value)} />
                            <label htmlFor="billaddress">Billing Address</label>
                        </span>

                        <span className="p-float-label">
                            <InputText id="gstin" value={gst} onChange={(e) => setGst(e.target.value)} />
                            <label htmlFor="gstin">GSTIN</label>
                        </span>

                        <span className="p-float-label">
                            <InputText id="brandname" value={brandName} onChange={(e) => setBrandName(e.target.value)} />
                            <label htmlFor="brandname">GSTIN</label>
                        </span>

                        <span className="p-float-label">
                            <InputText id="billingphone" value={billingPhone} onChange={(e) => setBillingPhone(e.target.value)} />
                            <label htmlFor="billingphone">Billing Phone No.</label>
                        </span>

                        <span className="p-float-label">
                            <InputText id="statecode" value={stateCode} onChange={(e) => setStateCode(e.target.value)} />
                            <label htmlFor="statecode">Billing Phone No.</label>
                        </span>

                        <span className="p-float-label">
                            <ToggleButton onLabel="Active" offLabel="InActive" onIcon="pi pi-check" offIcon="pi pi-times"
                                checked={status} onChange={(e) => setStatus(e.value)} placeholder='Status' className="w-9rem" />
                        </span>


                        <Button label="Submit" className='w-fit' />
                    </div>

                </form>

            </div>
        </>

    )
}


export default CreateTask