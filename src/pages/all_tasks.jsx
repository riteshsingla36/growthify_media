import React, { useState, useEffect } from 'react';
import { FilterMatchMode } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import axios from 'axios';
import { getCookie } from 'cookies-next';

const AllTasks = (props) => {
  const [filters, setFilters] = useState({
    'assignor.name': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'assignee.name': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'client.name': { value: null, matchMode: FilterMatchMode.CONTAINS },
    priority: { value: null, matchMode: FilterMatchMode.EQUALS },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
  });

  const [statuses] = useState(['inProgress', 'pending', 'completed']);
  const [priorities] = useState(['low', 'medium', 'high']);
  const cookies = getCookie('growthify_user');

  const statusItemTemplate = (option) => {
    return <Tag value={option} severity={getSeverity(option)} />;
  };

  const getSeverity = (status) => {
    switch (status) {
      case 'pending':
        return 'danger';
      case 'completed':
        return 'success';
      case 'inProgress':
        return 'warning';
      case 'low':
        return 'success';
      case 'medium':
        return 'warning';
      case 'high':
        return 'danger';
    }
  };

  const deadlinedateBodyTemplate = (rowData) => {
    return formatDate(rowData.deadline);
  };
  const createdAtdateBodyTemplate = (rowData) => {
    return formatDate(rowData.createdAt);
  };
  const updatedAtdateBodyTemplate = (rowData) => {
    return formatDate(rowData.updatedAt);
  };

  const formatDate = (value) => {
    const date = new Date(value);
    const localizedDateString = date.toLocaleDateString('en-IN');
    return localizedDateString;
  };

  const isSelectable = (data) => data.status != 'completed';

  const isRowSelectable = (event) =>
    event.data ? isSelectable(event.data) : true;

  const rowClassName = (data) =>
    isSelectable(data) ? '' : 'bg-success text-white p-disabled';

  const statusBodyTemplate = (rowData) => {
    return (
      <Tag value={rowData.status} severity={getSeverity(rowData.status)} />
    );
  };

  const priorityBodyTemplate = (rowData) => {
    return (
      <Tag value={rowData.priority} severity={getSeverity(rowData.priority)} />
    );
  };

  const statusRowFilterTemplate = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={statuses}
        onChange={(e) => options.filterApplyCallback(e.value)}
        itemTemplate={statusItemTemplate}
        placeholder="Select One"
        className="p-column-filter"
        showClear
        style={{ minWidth: '12rem' }}
      />
    );
  };

  const priorityRowFilterTemplate = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={priorities}
        onChange={(e) => options.filterApplyCallback(e.value)}
        itemTemplate={statusItemTemplate}
        placeholder="Select One"
        className="p-column-filter"
        showClear
        style={{ minWidth: '12rem' }}
      />
    );
  };

  const textEditor = (options) => {
    return (
      <InputText
        type="text"
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
      />
    );
  };

  const statusEditor = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={statuses}
        onChange={(e) => options.editorCallback(e.value)}
        placeholder="Select a Status"
        itemTemplate={(option) => {
          return <Tag value={option} severity={getSeverity(option)}></Tag>;
        }}
      />
    );
  };

  const employeesEditor = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={Object.keys(props.employees)}
        onChange={(e) => options.editorCallback(e.value)}
        placeholder="Select an Employee"
      />
    );
  };

  const descriptionEditor = (options) => {
    return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
  };
  const supportingLinkEditor = (options) => {
    return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
  };
  const supportingRemarkEditor = (options) => {
    return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
  };


  const onRowEditComplete = async (e) => {
    const user = JSON.parse(cookies);
    const newData = e.newData;
    const oldData = e.data;
    try {
      await axios.patch(`/api/update_task?taskId=${oldData._id}`, {assignee: newData.assignee, assignor: newData.assignor, status: newData.status, supportingLink: newData.supportingLink, supportingRemarks: newData.supportingRemarks, description: newData.description, updatedBy: user._id})
      alert("task updated successfully")
      window.location.reload();
    } catch (error) {
      alert(error.response.data);
    }
  };

  return (
    <>
      <div className="grid w-[95vw] m-auto">
        <div className="col-12 md:col-6 lg:col-3">
          <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
            <div className="flex justify-content-between mb-3">
              <div>
                <span className="block text-500 font-medium mb-3">
                  All Tasks
                </span>
                <div className="text-900 font-medium text-xl">
                  {props.counts['all']}
                </div>
              </div>
              <div
                className="flex align-items-center justify-content-center bg-blue-100 border-round"
                style={{ width: '2.5rem', height: '2.5rem' }}
              >
                <i className="pi pi-shopping-cart text-blue-500 text-xl"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 md:col-6 lg:col-3">
          <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
            <div className="flex justify-content-between mb-3">
              <div>
                <span className="block text-500 font-medium mb-3">
                  Pending Tasks
                </span>
                <div className="text-900 font-medium text-xl">
                  {props.counts['pending']}
                </div>
              </div>
              <div
                className="flex align-items-center justify-content-center bg-orange-100 border-round"
                style={{ width: '2.5rem', height: '2.5rem' }}
              >
                <i className="pi pi-map-marker text-orange-500 text-xl"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 md:col-6 lg:col-3">
          <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
            <div className="flex justify-content-between mb-3">
              <div>
                <span className="block text-500 font-medium mb-3">
                  In Progress Tasks
                </span>
                <div className="text-900 font-medium text-xl">
                  {props.counts['inProgress']}
                </div>
              </div>
              <div
                className="flex align-items-center justify-content-center bg-cyan-100 border-round"
                style={{ width: '2.5rem', height: '2.5rem' }}
              >
                <i className="pi pi-inbox text-cyan-500 text-xl"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 md:col-6 lg:col-3">
          <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
            <div className="flex justify-content-between mb-3">
              <div>
                <span className="block text-500 font-medium mb-3">
                  Completed Tasks
                </span>
                <div className="text-900 font-medium text-xl">
                  {props.counts['completed']}
                </div>
              </div>
              <div
                className="flex align-items-center justify-content-center bg-purple-100 border-round"
                style={{ width: '2.5rem', height: '2.5rem' }}
              >
                <i className="pi pi-comment text-purple-500 text-xl"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card w-[95vw] m-auto !h-[75vh]">
        <DataTable
          scrollable
          isDataSelectable={isRowSelectable}
          rowClassName={rowClassName}
          sortField="createdAt"
          removableSort
          sortOrder={-1}
          scrollHeight="90vh"
          showGridlines
          editMode="row"
          onRowEditComplete={onRowEditComplete}
          value={props.tasks}
          paginator
          rows={10}
          dataKey="_id"
          filters={filters}
          filterDisplay="row"
          globalFilterFields={[
            'name',
            'country.name',
            'representative.name',
            'status',
          ]}
          emptyMessage="No customers found."
          tableStyle={{ minWidth: '50rem' }}
        >
          <Column
            rowEditor
            headerStyle={{ width: '10%', minWidth: '2rem' }}
            bodyStyle={{ textAlign: 'center' }}
          ></Column>
          <Column
            field="assignor.name"
            header="Assignor"
            editor={(options) => employeesEditor(options)}
            filter
            filterPlaceholder="Search by name"
            style={{ minWidth: '12rem' }}
          />
          <Column
            field="assignee.name"
            header="Assignee"
            editor={(options) => employeesEditor(options)}
            filter
            filterPlaceholder="Search by name"
            style={{ minWidth: '12rem' }}
          />
          <Column
            field="client.name"
            header="Client"
            filter
            filterPlaceholder="Search by name"
            style={{ minWidth: '12rem' }}
          />
          <Column
            field="status"
            header="Status"
            editor={(options) => statusEditor(options)}
            showFilterMenu={false}
            filterMenuStyle={{ width: '14rem' }}
            style={{ minWidth: '12rem' }}
            body={statusBodyTemplate}
            filter
            filterElement={statusRowFilterTemplate}
          />
          <Column
            field="priority"
            header="Priority"
            showFilterMenu={false}
            filterMenuStyle={{ width: '14rem' }}
            style={{ minWidth: '12rem' }}
            body={priorityBodyTemplate}
            filter
            filterElement={priorityRowFilterTemplate}
          />
          <Column
            field="deadline"
            body={deadlinedateBodyTemplate}
            header="Deadline"
            sortable
            style={{ minWidth: '12rem' }}
          />
          <Column
            field="description"
            header="Description"
            editor={(options) => descriptionEditor(options)}
            style={{ minWidth: '12rem' }}
          />
          <Column
            field="supportingLink"
            header="Supporting Link"
            editor={(options) => supportingLinkEditor(options)}
            style={{ minWidth: '12rem' }}
          />
          <Column
            field="supportingRemarks"
            header="Supporting Remarks"
            editor={(options) => supportingRemarkEditor(options)}
            style={{ minWidth: '12rem' }}
          />
          <Column
            field="createdBy.name"
            header="CreatedBy"
            style={{ minWidth: '12rem' }}
          />
          <Column
            field="updatedBy.name"
            header="UpdatedBy"
            style={{ minWidth: '12rem' }}
          />
          <Column
            field="createdAt"
            body={createdAtdateBodyTemplate}
            header="CreatedAt"
            sortable
            style={{ minWidth: '12rem' }}
          />
          <Column
            field="updatedAt"
            body={updatedAtdateBodyTemplate}
            header="UpdatedAt"
            sortable
            style={{ minWidth: '12rem' }}
          />
        </DataTable>
      </div>
    </>
  );
};

export async function getServerSideProps(context) {
  const cookies = context.req.cookies;
  const { res } = context;
  
  if (!cookies.growthify_user) {
    res.setHeader('location', '/login');
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }
  const user = JSON.parse(cookies.growthify_user);
  let tasks
  if(!user.isAdmin) {
    tasks = await axios.get(
      `https://growthify-media.vercel.app/api/get_tasks?assignee=${user._id}`
    );
  }
  else {
    tasks = await axios.get(
      `https://growthify-media.vercel.app/api/get_tasks`
    );
  }
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

  var counts = { all: 0, pending: 0, inProgress: 0, completed: 0 };
  counts.all = tasks.data.length;

  for (let i = 0; i < tasks.data.length; i++) {
    const task = tasks.data[i];
    if (task.status === 'completed') {
      counts.completed++;
    } else if (task.status === 'pending') {
      counts.pending++;
    } else {
      counts.inProgress++;
    }
  }
  return {
    props: { tasks: tasks.data, clients, employees, counts },
  };
}

export default AllTasks;
