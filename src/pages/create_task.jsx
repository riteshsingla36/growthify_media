import React, { useEffect, useState } from 'react'
import { Dropdown } from 'primereact/dropdown';
import axios from 'axios';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';

import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';


const CreateTask = (props) => {

    const [client, setClient] = useState(null);
    const [assignor, setAssignor] = useState(null);
    const [assignee, setAssinee] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [projects, setProjects] = useState(null);
    const [selectedPriority, setSelectedPriority] = useState(null);
    const [remarks, setRemarks] = useState('');
    const [link, setLink] = useState('');
    const [date, setDate] = useState(null);
    const [desc, setDesc] = useState('');
    const clients = Object.values(props.clients);
    const employees = Object.values(props.employees);
    const priority = [{
        "name": "low"
    }, {
        "name": "medium"
    }, {
        "name": "high"
    }]
    const dateTemplate = (date) => {
        if (date.day > 10 && date.day < 15) {
            return (
                <strong style={{ textDecoration: 'line-through' }}>{date.day}</strong>
            );
        }
        return date.day;
    }

    const addProjects = (projects) => {
        let prj = [];
        projects.forEach((element) => {
            prj.push({
                "name": element
            })
        });
        setProjects(prj);
    }

    const createTask = async () => {
        const res = await axios.post("/api/create_task", {
            assignor: assignor._id,
            assignee: assignee._id,
            client: assignor._id,
            selectedProject: selectedProject.name,
            selectedPriority: selectedPriority.name,
            deadline: date,
            description: desc,
            supportingLink: link,
            supportingRemarks: remarks,
            createdBy: ""
        });

    }

    return (
        <>
            <h1 className='w-full m-auto text-center !bg-[#304562] text-white !pt-5'>CREATE TASK</h1>

            <div className='w-full h-[100vh] flex justify-center items-center !bg-[#304562]'>
                <form action="#" method='POST' onSubmit={createTask}>
                    <div className="card !grid border-0 grid-cols-2 gap-4 !bg-[#304562]">
                        <Dropdown value={assignor} onChange={(e) => setAssignor(e.value)} options={employees} optionLabel="name"
                            placeholder="Select Assignor" className=" md:w-14rem" />

                        <Dropdown value={assignee} onChange={(e) => { setAssinee(e.value); }} options={employees} optionLabel="name"
                            placeholder="Select Assignee" className="md:w-14rem" />

                        <Dropdown value={client} onChange={(e) => { setClient(e.value); addProjects(e.value.projects); }} options={clients} optionLabel="name"
                            placeholder="Select Client" className="md:w-14rem" />

                        <Dropdown value={selectedProject} onChange={(e) => setSelectedProject(e.value)} options={projects} optionLabel="name"
                            placeholder="Select Projects" className="md:w-14rem" />

                        <Dropdown value={selectedPriority} onChange={(e) => setSelectedPriority(e.value)} options={priority} optionLabel="name"
                            placeholder="Select Priority" className="md:w-14rem" />
                        <div>
                            <span className="p-float-label">
                                <Calendar value={date} id='deadline' onChange={(e) => setDate(e.value)} dateTemplate={dateTemplate} />
                                <label htmlFor="deadline">Deadline</label>
                            </span>

                        </div>
                        <span className="p-float-label">
                            <InputTextarea id="description" value={desc} onChange={(e) => setDesc(e.target.value)} rows={5} cols={30} />
                            <label htmlFor="description">Description</label>
                        </span>
                        <div>
                            <InputText type="url" name="url" id="url"
                                placeholder="https://example.com"
                                value={link}
                                pattern="https://.*" size="30"
                                required onChange={(e) => setLink(e.target.value)}></InputText>
                        </div>
                        <div>

                            <span className="p-float-label">
                                <InputTextarea id="supportingremarks" value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={5} cols={30} />
                                <label htmlFor="supportingremarks">Supporting Remarks</label>
                            </span>
                            <Button label="Submit" className='w-fit' />
                        </div>
                    </div>

                </form>

            </div>
        </>

    )
}


export async function getServerSideProps(context) {
    const usersData = await axios.get(
        'https://growthify-media.vercel.app/api/get_users'
    );
    let clients = {};
    let employees = {};
    for (let i = 0; i < usersData.data.length; i++) {
        const user = usersData.data[i];
        if (user.userType === 'Employee') {
            if (!employees[user.name]) {
                employees[user.name] = user;
            }
        } else {
            if (!clients[user.name]) {
                clients[user.name] = user;
            }
        }
    }

    return {
        props: { clients, employees },
    };
}

export default CreateTask