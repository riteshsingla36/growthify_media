import React, { useEffect, useState } from 'react'
import { Dropdown } from 'primereact/dropdown';
import axios from 'axios';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { InputMask } from 'primereact/inputmask';
import { ToggleButton } from 'primereact/togglebutton';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';


const CreateTask = (props) => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState(null);
    const [role, setRole] = useState("");
    const [userId, setUserId] = useState("");
    const [selectedUserType, setSelectedUserType] = useState(null);
    const [status, setStatus] = useState(true);
    const userTypes = [{
        "name": "Employee"
    }, {
        "name": "Client"
    }]


    const createUser = async () => {
        const res = await axios.post("/api/create_user", {
            name,
            email,
            phoneNo: phone,
            userType: selectedUserType,
            role,
            userId,
            status: status ? "ACTIVE" : "INACTIVE",
            createdBy: ""
        });
    }

    return (
        <>
            <h1 className='w-full m-auto text-center !bg-[#304562] text-white !pt-5'>CREATE USER</h1>
            <div className='w-full h-[60vh] flex justify-center items-center !bg-[#304562]'>
                <form action="#" method='POST' onSubmit={createUser}>
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
                            <InputMask value={userId} onChange={(e) => setUserId(e.target.value)} mask="a**-999" placeholder="Phone No." />
                        </div>

                        <ToggleButton onLabel="Active" offLabel="InActive" onIcon="pi pi-check" offIcon="pi pi-times"
                            checked={status} onChange={(e) => setStatus(e.value)} className="w-9rem" />

                        <span className="p-float-label">
                            <InputText id="role" value={role} onChange={(e) => setRole(e.target.value)} />
                            <label htmlFor="role">Role</label>
                        </span>

                        <Dropdown value={selectedUserType} onChange={(e) => setSelectedUserType(e.value)} options={userTypes} optionLabel="name"
                            placeholder="Select User Type" className="w-full md:w-14rem" />

                        <div>

                            <Button label="Submit" className='w-fit' />
                        </div>
                    </div>

                </form>

            </div>
        </>

    )
}


export default CreateTask