  export const tenantFormFields  = (formData:any) => [

    {
      id: 1,
      name: "name",
      type: "text",
      value: formData.name,
      label: "Company Name",
      placeHolder:'UnitedContracting'
  
    },
    {
      id: 2,
      name: "industry",
      type: "text",
      value: formData.industry,
      label: "Industry",
      placeHolder:'Construction'

    },
    {
      id: 3,
      name: "phone",
      type: "text",
      value: formData.phone,
      label: "Phone Number",
      placeHolder:'+1 234 567 890'

    },
    {
      id: 4,
      name: "maxEmployees",
      type: "number",
      value: formData.maxEmployees,
      label: "Number of Employees",
      placeHolder:''

    },
    {
      id: 5,
      name: "address",
      type: "text",
      value: formData.address,
      label: "Address",
      placeHolder:''

    },
    {
      id: 6,
      name: "adminName",
      type: "text",
      value: formData.adminName,
      label: "Admin Name",
      placeHolder:'John Doe'

    },
    {
      id: 7,
      name: "adminEmail",
      type: "Email",
      value: formData.adminEmail,
      label: "Admin Email",
      placeHolder:'john.doe@company.com'

    },
    {
      id: 8,
      name: "adminPassword",
      type: "password",
      value: formData.adminPassword,
      label: "Admin Password",
      placeHolder:''

    },
    {
      id: 9,
      name: "kvkNumber",
      type: "text",
      value: formData.kvkNumber,
      label: "KVK Number",
      placeHolder:''

    },
    {
      id: 10,
      name: "btwNumber",
      type: "text",
      value: formData.btwNumber,
      label: "BTW Number",
      placeHolder:''

    },
       {
      id: 11,
      name: "databaseName",
      type: "text",
      value: formData.databaseName,
      label: "Database Name",
      placeHolder:''

    },
          {
      id: 12,
      name: "subscriptionStartDate",
      type: "date",
      value: formData.subscriptionStartDate,
      label: "Subscription Start Date",
      placeHolder:''

    },
       {
      id: 12,
      name: "subscriptionEndDate",
      type: "date",
      value: formData.subscriptionEndDate,
      label: "Subscription End Date",
      placeHolder:''

    },
       {
      id: 13,
      name: "discount",
      type: "number",
      value: formData.discount,
      label: "Discount %",
      placeHolder:''

    },
  ];