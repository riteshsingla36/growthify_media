import React, { useState, useEffect } from 'react';
import { FilterMatchMode } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

const AllUsers = (props) => {
  const [filters, setFilters] = useState({
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    email: { value: null, matchMode: FilterMatchMode.CONTAINS },
    userType: { value: null, matchMode: FilterMatchMode.EQUALS },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
  });
  const [visible, setVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [statuses] = useState(['ACTIVE', 'INACTIVE']);
  const [userType] = useState(['Employee', 'Client']);
  const cookies = getCookie('growthify_user');

  const statusItemTemplate = (option) => {
    return <Tag value={option} severity={getSeverity(option)} />;
  };

  const userTypeItemTemplate = (option) => {
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
      case 'INACTIVE':
        return 'danger';
    }
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

  const projectsBodyTemplate = (rowData) => {
    return rowData.projects.join(",");
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

  const invoiceBodyTemplate = (rowData) => {
    return (
      <Button icon="pi pi-download" tooltip='Download Invoice' onClick={() => {setVisible(true); setSelectedUser(rowData)}} tooltipOptions={{position: 'bottom'}} rounded outlined severity="success" aria-label="Search" className='' />
    )
  }

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

  const userTypeRowFilterTemplate = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={userType}
        onChange={(e) => options.filterApplyCallback(e.value)}
        itemTemplate={userTypeItemTemplate}
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

  const userTypeEditor = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={userType}
        onChange={(e) => options.editorCallback(e.value)}
        placeholder="Select a UserType"
        itemTemplate={(option) => {
          return <Tag value={option} severity={getSeverity(option)}></Tag>;
        }}
      />
    );
  };

  const onRowEditComplete = async (e) => {
    const newData = e.newData;
    const oldData = e.data;
    try {
      await axios.patch(`/api/update_user?userId=${oldData._id}`, {
        status: newData.status,
        billingAddress: newData.billingAddress,
        projects: newData.projects,
        GSTIN: newData.GSTIN,
        billingPhoneNo: newData.billingPhoneNo,
        brandName: newData.brandName,
        stateCode: newData.stateCode
      })
      alert("User updated successfully")
      window.location.reload();
    } catch (error) {
      alert(error.response.data);
    }
  };

  const billingAddressEditor = (options) => {
    return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
};
  const gstEditor = (options) => {
    return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
  };
  const billingPhoneEditor = (options) => {
    return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
  };
  const brandNameEditor = (options) => {
    return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
  };
  const stateCodeEditor = (options) => {
    return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
  };
  const projectCodeEditor = (options) => {
    return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
  };
  const footerContent = (
    <div>
        <Button label="No" icon="pi pi-times" onClick={() => setVisible(false)} className="p-button-text" />
        <Button label="Yes" icon="pi pi-check" onClick={() => setVisible(false)} autoFocus />
    </div>
);

  return (
    <>
      <div className="w-[95vw] m-auto !h-[75vh]">
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
          value={props.users}
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
          />
          <Column
            field="userId"
            header="User Id"
            style={{ minWidth: '12rem' }}
          />
          <Column
            field="name"
            header="Name"
            filter
            filterPlaceholder="Search by name"
            style={{ minWidth: '12rem' }}
          />
          <Column
            field="email"
            header="Email"
            filter
            filterPlaceholder="Search by name"
            style={{ minWidth: '12rem' }}
          />
          <Column
            field="phoneNo"
            header="Phone No."
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
            field="userType"
            header="User Type"
            showFilterMenu={false}
            filterMenuStyle={{ width: '14rem' }}
            style={{ minWidth: '12rem' }}
            filter
            filterElement={userTypeRowFilterTemplate}
          />
          <Column
            field="role"
            header="role"
            showFilterMenu={false}
            filterMenuStyle={{ width: '14rem' }}
            style={{ minWidth: '12rem' }}
            filterElement={priorityRowFilterTemplate}
          />
          <Column
            field="projects"
            header="Projects"
            body={projectsBodyTemplate}
            editor={(options) => projectCodeEditor(options)}
            sortable
            style={{ minWidth: '12rem' }}
          />
          <Column
            field="billingAddress"
            header="Billing Address"
            editor={(options) => billingAddressEditor(options)}
            style={{ minWidth: '12rem' }}
          />
          <Column
            field="GSTIN"
            header="GSTIN"
            editor={(options) => gstEditor(options)}
            style={{ minWidth: '12rem' }}
          />
          <Column
            field="billingPhoneNo"
            header="Billing Phone No."
            editor={(options) => billingPhoneEditor(options)}
            style={{ minWidth: '12rem' }}
          />
          <Column
            field="brandName"
            header="Brand Name"
            editor={(options) => brandNameEditor(options)}
            style={{ minWidth: '12rem' }}
          />
          <Column
            field="stateCode"
            header="State Code"
            editor={(options) => stateCodeEditor(options)}
            sortable
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
          <Column
            
            body={invoiceBodyTemplate}
          >
          </Column>
        
        </DataTable>
        <Dialog header="Create Invoice" visible={visible} position='right' style={{ width: '50vw' }} onHide={() => setVisible(false)} footer={footerContent} resizable maximizable>
          {selectedUser && <div className='mt-10 flex flex-row gap-4'>
            <span className='flex flex-col gap-4'>

              <span className="p-float-label">
                <InputText id="username" defaultValue={selectedUser.name} disabled />
                <label htmlFor="username">Name</label>
              </span>

              <span className="p-float-label">
                <InputText id="email" defaultValue={selectedUser.email} disabled/>
                <label htmlFor="email">email</label>
              </span>

              <span className="p-float-label">
                <InputText id="billingPhoneNo" defaultValue={selectedUser.billingPhoneNo} disabled/>
                <label htmlFor="billingPhoneNo">billingPhoneNo</label>
              </span>

              <span className="p-float-label">
                <InputText id="billingAddress" defaultValue={selectedUser.billingAddress} disabled/>
                <label htmlFor="billingAddress">billingAddress</label>
              </span>

              <span className="p-float-label">
                <InputText id="GSTIN" defaultValue={selectedUser.GSTIN} disabled/>
                <label htmlFor="GSTIN">GSTIN</label>
              </span>

              <span className="p-float-label">
                <InputText id="brandName" defaultValue={selectedUser.brandName} disabled/>
                <label htmlFor="brandName">brandName</label>
              </span>

              <span className="p-float-label">
                <InputText id="stateCode" defaultValue={selectedUser.stateCode} disabled/>
                <label htmlFor="stateCode">stateCode</label>
              </span>
            </span>

            <span className='flex flex-col gap-4'>
              <span className="p-float-label">
                <InputText id="itemDescription" />
                <label htmlFor="itemDescription">itemDescription</label>
              </span>

              <span className="p-float-label">
                <InputText id="itemQty" />
                <label htmlFor="itemQty">itemQty</label>
              </span>

              <span className="p-float-label">
                <InputText id="amount" />
                <label htmlFor="amount">amount</label>
              </span>
            </span>

          </div>
          }
        </Dialog>
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

  const usersData = await axios.get(
    'https://growthify-media.vercel.app/api/get_users'
  );
  return {
    props: { users: usersData.data },
  };
}

export default AllUsers;
