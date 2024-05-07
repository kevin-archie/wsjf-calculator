import React, {useState, useEffect, useRef} from "react";
import {Button, Input, Table, Typography, Tooltip, Modal, Form, Row, Col, Select, Spin} from "antd";
import {
    PlusOutlined,
    MinusOutlined,
    DeleteOutlined,
    ReloadOutlined,
    SyncOutlined,
    FireOutlined,
    CheckCircleOutlined,
    LoadingOutlined,
} from "@ant-design/icons";
import {v4 as uuidv4} from "uuid";
import {faker} from '@faker-js/faker';
import post from "./api/calculator";
import jiraClient from "./api/jira";
import calculateInitiateTasks from "./api/calculateInitiateTasks";
import Footer from './footer';
import Epic16Icon from '@atlaskit/icon-object/glyph/epic/16'
import Story16Icon from '@atlaskit/icon-object/glyph/story/16'

const {Text, Title} = Typography;

const {Option} = Select;

export async function getServerSideProps() {
    const initialTasks = [
        {
            id: uuidv4(),
            issue_key: faker.number.int({min: 10, max: 999}),
            issue_summary: '[FE][Mobile] User Module',
            business_value: faker.helpers.arrayElement([0, 1, 2, 3, 5, 8, 13, 20, 40]),
            time_criticality: faker.helpers.arrayElement([0, 1, 2, 3, 5, 8, 13, 20, 40]),
            risk_opportunity: faker.helpers.arrayElement([0, 1, 2, 3, 5, 8, 13, 20, 40]),
            job_duration: faker.helpers.arrayElement([1, 2, 3, 5, 8, 13, 20, 40])
        },
        {
            id: uuidv4(),
            issue_key: faker.number.int({min: 10, max: 999}),
            issue_summary: '[BE][API] new API for User Registration',
            business_value: faker.helpers.arrayElement([0, 1, 2, 3, 5, 8, 13, 20, 40]),
            time_criticality: faker.helpers.arrayElement([0, 1, 2, 3, 5, 8, 13, 20, 40]),
            risk_opportunity: faker.helpers.arrayElement([0, 1, 2, 3, 5, 8, 13, 20, 40]),
            job_duration: faker.helpers.arrayElement([1, 2, 3, 5, 8, 13, 20, 40])
        },
        {
            id: uuidv4(),
            issue_key: faker.number.int({min: 10, max: 999}),
            issue_summary: '[FE][WEB] User Management Module',
            business_value: faker.helpers.arrayElement([0, 1, 2, 3, 5, 8, 13, 20, 40]),
            time_criticality: faker.helpers.arrayElement([0, 1, 2, 3, 5, 8, 13, 20, 40]),
            risk_opportunity: faker.helpers.arrayElement([0, 1, 2, 3, 5, 8, 13, 20, 40]),
            job_duration: faker.helpers.arrayElement([1, 2, 3, 5, 8, 13, 20, 40])
        },
    ];

    const tasksWithWSJF = await Promise.all(initialTasks.map(calculateInitiateTasks));

    return {props: {initialTasks: tasksWithWSJF}};
}

export default function Home({initialTasks}) {
    const [form] = Form.useForm();
    const [isAddTaskEnabled, setIsAddTaskEnabled] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitModalVisible, setIsSubmitModalVisible] = useState(false);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [isDateValid, setIsDateValid] = useState(true);
    const [isSubmitParentEnabled, setIsSubmitParentEnabled] = useState(false);
    const [isLoadingFetchingChildren, setIsLoadingFetchingChildren] = useState(false);
    const [isLoadingGenerateSubtasks, setIsLoadingGenerateSubtasks] = useState(false);
    const [parentDetail, setParentDetail] = useState(null);
    const [abortFetchingChildrenController, setAbortFetchingChildrenController] = useState(null);
    const [isIssueKeyParentNotFound, setIsIssueKeyParentNotFound] = useState(false);
    const [isCheckingParentIsError, setIsCheckingParentIsError] = useState(false);
    const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true);
    const [isShowReloadButton, setIsShowReloadButton] = useState(true);
    const [isRemoveErrorMessage, setIsRemoveErrorMessage] = useState(false);
    const [isLoadingSubmitJira, setIsLoadingSubmitJira] = useState(false);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const years = Array.from({length: 5}, (_, i) => new Date().getFullYear() + i);
    const currentYear = new Date().getFullYear();
    const currentMonth = months[new Date().getMonth()];
    const availableMonths = months.slice(selectedMonth);
    const [currentMonthIndex, setCurrentMonthIndex] = useState(new Date().getMonth());

    const [isPaywallVisible, setIsPaywallVisible] = useState(false);

    const [isModalFetchChildrenVisible, setIsModalFetchChildrenVisible] = useState(false);
    const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
    const [cardNumber, setCardNumber] = useState('');

    const showModal = () => {
        setIsModalFetchChildrenVisible(true);
    };

    const handleOk = async () => {
        const issueKey = form.getFieldValue('parentIssueKey');

        setIsModalFetchChildrenVisible(false);
        setIsLoadingGenerateSubtasks(true);

        try {
            const response = await jiraClient.getChildren(issueKey);
            if (response?.status === 200) {
                const result = response.data.issues;

                console.log("result: ", result)

                if (result.length === 0) {
                    Modal.warning({
                        title: 'Warning',
                        content: 'The selected issue does not have any associated sub-tasks.',
                    });
                }

                setIsLoadingFetchingChildren(false);
                const mappedChildrenTasks = result.map((task) => ({
                    id: uuidv4(),
                    issue_key: task.key,
                    issue_summary: task.fields.summary,
                    business_value: null,
                    time_criticality: null,
                    risk_opportunity: null,
                    job_duration: null,
                }));

                setTask(mappedChildrenTasks)
                setIsSubmitParentEnabled(true);
                setIsIssueKeyParentNotFound(false);
                setIsAddTaskEnabled(false);
                return result;
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('Fetch aborted');
            } else {
                console.error('Fetch error:', error);
            }

            setIsSubmitParentEnabled(true);
            setIsLoadingGenerateSubtasks(false);
            setIsAddTaskEnabled(true);
            return null;
        }
    };

    const handleCancelModalFetchChildren = () => {
        setIsModalFetchChildrenVisible(false);
    };

    const formatCardNumber = (value) => {
        const onlyNums = value.replace(/[^\d]/g, '');
        return onlyNums.replace(/(\d{4})/g, '$1 ').trimEnd();
    };

    const [isFormValid, setIsFormValid] = useState(false);
    useEffect(() => {
        form.validateFields()
            .then(() => setIsFormValid(true))
            .catch(() => setIsFormValid(false));
    }, [form]);

    const [task, setTask] = useState(initialTasks);
    const [updatedTaskId, setUpdatedTaskId] = useState(null);
    const [updateKey, setUpdateKey] = useState(0);

    useEffect(() => {
        if (updatedTaskId) {
            const updatedTask = task.find((task) => task.id === updatedTaskId);
            if (updatedTask) {
                if (updatedTask.job_duration) {
                    calculateWSJF(updatedTask);
                } else {
                    setTask((prevTask) =>
                        prevTask.map((task) =>
                            task.id === updatedTaskId ? {...task, wsjf_score: null} : task
                        )
                    );
                }
            }
        }
    }, [updatedTaskId, updateKey]);

    const addButtonRef = useRef(null);
    useEffect(() => {
        if (addButtonRef.current) {
            addButtonRef.current.scrollIntoView({behavior: 'smooth'});
        }
    }, [task]);

    useEffect(() => {
        const modalElement = document.querySelector('.custom-modal .ant-modal');
        if (modalElement) {
            modalElement.style.height = '85%';
        }
    }, [isPaywallVisible]);

    useEffect(() => {
        const areAllFieldsFilled = task.every((taskItem) => {
            return taskItem.issue_key && taskItem.issue_summary && taskItem.business_value && taskItem.time_criticality && taskItem.risk_opportunity && taskItem.job_duration;
        });
        setIsSubmitButtonDisabled(!areAllFieldsFilled);
    }, [task]);

    const calculateWSJF = async (row) => {
        const {
            issue_key,
            business_value,
            time_criticality,
            risk_opportunity,
            job_duration,
        } = row;

        const responseCalculateWSJF = await post(row.id, {
            issue_key,
            business_value,
            time_criticality,
            risk_opportunity,
            job_duration,
        });

        console.log("responseCalculateWSJF", responseCalculateWSJF)

        if (responseCalculateWSJF?.status === 200) {
            setTask((prevTask) =>
                prevTask.map((task) =>
                    task.id === responseCalculateWSJF.data.id ? {
                        ...task,
                        wsjf_score: responseCalculateWSJF.data.wsjf
                    } : task
                )
            );
        }
    };

    const checkParentIssueKey = async (issueKey) => {
        console.log("Fetching...", issueKey)
        setIsLoadingFetchingChildren(true);
        const controller = new AbortController();
        setAbortFetchingChildrenController(controller);

        try {
            const response = await jiraClient.post(issueKey);
            console.log("res: ", response)
            if (response?.status === 200) {

                setIsLoadingFetchingChildren(false);

                if (!response.data.key) {
                    setIsIssueKeyParentNotFound(true);
                } else {
                    response.data.fields.key = response.data.key;

                    const result = response.data.fields;

                    setIsIssueKeyParentNotFound(false);

                    if (result.issuetype.id !== "10000" && result.issuetype.id !== "10001") {
                        setIsCheckingParentIsError(true);
                    } else {
                        setIsCheckingParentIsError(false);
                        setParentDetail(result);
                        setIsSubmitParentEnabled(true);
                    }

                    return result;
                }
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('Fetch aborted');
            } else {
                console.error('Fetch error:', error);
            }

            setIsLoadingFetchingChildren(false);
            setParentDetail(null);
            setIsSubmitParentEnabled(false);
            setIsLoadingFetchingChildren(false);
            setIsCheckingParentIsError(true);
            return null;
        }
    }

    const updateTask = async (issueKey, wsjf_score) => {
        const response = await jiraClient.updateTask(issueKey, wsjf_score)
    }

    const handleCancelFetchingChildren = () => {
        if (abortFetchingChildrenController) {
            abortFetchingChildrenController.abort();
        }
        setIsLoadingFetchingChildren(false);
    }

    const addTask = () => {
        setTask((prevTask) => [
            ...prevTask,
            {id: uuidv4(), issue_key: '', business_value: null, risk_opportunity: null, job_duration: null},
        ]);
    };

    useEffect(() => {
        if (task.length === 0) {
            setIsAddTaskEnabled(true);
            // setIsShowReloadButton(false);
        }
    }, [task]);

    const removeTask = (id) => {
        setTask((prevTask) =>
            prevTask.filter((task) => task.id !== id)
        );
    };

    const handleValueChange = (newValue, id, field) => {
        const allowedValues = [0, 1, 2, 3, 5, 8, 13, 20, 40];
        let value;
        if (field === 'job_duration') {
            value = newValue !== '' ? newValue : 1;
        } else {
            value = allowedValues.includes(Number(newValue)) ? newValue : 0;
        }
        setTask((prevTask) =>
            prevTask.map((task) =>
                task.id === id ? {...task, [field]: value} : task
            )
        );

        setUpdatedTaskId(id);
        setUpdateKey(prevKey => prevKey + 1);
    };

    const incrementValue = (currentValue, id, field) => {
        const allowedValues = [0, 1, 2, 3, 5, 8, 13, 20, 40];
        const currentIndex = allowedValues.indexOf(Number(currentValue));
        if (currentIndex < allowedValues.length - 1) {
            handleValueChange(allowedValues[currentIndex + 1], id, field);
        }
    };

    const decrementValue = (currentValue, id, field) => {
        const allowedValues = [0, 1, 2, 3, 5, 8, 13, 20, 40];
        const currentIndex = allowedValues.indexOf(Number(currentValue));
        if (currentIndex > 0) {
            handleValueChange(allowedValues[currentIndex - 1], id, field);
        }
    };

    const columns = [
        {
            title: (
                <Tooltip title="Jira issue key">
                    Issue Key
                </Tooltip>
            ),
            dataIndex: 'issue_key',
            key: 'issue_key',
            align: 'center',
            width: 150,
            render: (text, record) => (
                <Input
                    value={text}
                    onChange={(e) => handleValueChange(e.target.value, record.id, 'issue_key')}
                />
            ),
        },
        {
            title: (
                <Tooltip title="Jira issue Summary">
                    Issue Summary
                </Tooltip>
            ),
            dataIndex: 'issue_summary',
            key: 'issue_summary',
            align: 'center',
            width: 400,
            render: (text, record) => (
                <Input
                    value={text}
                    onChange={(e) => handleValueChange(e.target.value, record.id, 'issue_summary')}
                />
            ),
        },
        {
            title: (
                <Tooltip title="How beneficial is this task to our organisation?">
                    Business Value
                </Tooltip>
            ),
            dataIndex: 'business_value',
            key: 'business_value',
            align: 'center',
            render: (text, record) => (
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <Button
                        icon={<MinusOutlined/>}
                        onClick={() => decrementValue(text, record.id, 'business_value')}
                        size="small"
                        style={{border: 'none', marginRight: '5px'}}
                    />
                    <Input
                        value={text}
                        onChange={(e) => handleValueChange(e.target.value, record.id, 'business_value')}
                        style={{width: '60px', textAlign: 'center'}}
                    />
                    <Button
                        icon={<PlusOutlined/>}
                        onClick={() => incrementValue(text, record.id, 'business_value')}
                        size="small"
                        style={{border: 'none', marginLeft: '5px'}}
                    />
                </div>
            ),
        },
        {
            title: (
                <Tooltip title="How urgent is it for the business?">
                    Time Criticality
                </Tooltip>
            ),
            dataIndex: 'time_criticality',
            key: 'time_criticality',
            align: 'center',
            render: (text, record) => (
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <Button
                        icon={<MinusOutlined/>}
                        onClick={() => decrementValue(text, record.id, 'time_criticality')}
                        size="small"
                        style={{border: 'none', marginRight: '5px'}}
                    />
                    <Input
                        value={text}
                        onChange={(e) => handleValueChange(e.target.value, record.id, 'time_criticality')}
                        style={{width: '60px', textAlign: 'center'}}
                    />
                    <Button
                        icon={<PlusOutlined/>}
                        onClick={() => incrementValue(text, record.id, 'time_criticality')}
                        size="small"
                        style={{border: 'none', marginLeft: '5px'}}
                    />
                </div>
            ),
        },
        {
            title: (
                <Tooltip title="Will this feature reduce our risk or help us get new business opportunities?">
                    Risk/Opportunity
                </Tooltip>
            ),
            dataIndex: 'risk_opportunity',
            key: 'risk_opportunity',
            align: 'center',
            render: (text, record) => (
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <Button
                        icon={<MinusOutlined/>}
                        onClick={() => decrementValue(text, record.id, 'risk_opportunity')}
                        size="small"
                        style={{border: 'none', marginRight: '5px'}}
                    />
                    <Input
                        value={text}
                        onChange={(e) => handleValueChange(e.target.value, record.id, 'risk_opportunity')}
                        style={{width: '60px', textAlign: 'center'}}
                    />
                    <Button
                        icon={<PlusOutlined/>}
                        onClick={() => incrementValue(text, record.id, 'risk_opportunity')}
                        size="small"
                        style={{border: 'none', marginLeft: '5px'}}
                    />
                </div>
            ),
        },
        {
            title: (
                <Tooltip title={<span style={{textAlign: 'center'}}>How long will the implementation take?</span>}>
                    Job Duration
                </Tooltip>
            ),
            dataIndex: 'job_duration',
            key: 'job_duration',
            align: 'center',
            render: (text, record) => (
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <Button
                        icon={<MinusOutlined/>}
                        onClick={() => decrementValue(text, record.id, 'job_duration')}
                        size="small"
                        style={{border: 'none', marginRight: '5px'}}
                    />
                    <Input
                        value={text}
                        onChange={(e) => handleValueChange(e.target.value, record.id, 'job_duration')}
                        style={{width: '60px', textAlign: 'center'}}
                    />
                    <Button
                        icon={<PlusOutlined/>}
                        onClick={() => incrementValue(text, record.id, 'job_duration')}
                        size="small"
                        style={{border: 'none', marginLeft: '5px'}}
                    />
                </div>
            ),
        },
        {
            title: 'WSJF',
            dataIndex: 'wsjf_score',
            key: 'wsjf_score',
            align: 'center',
            sorter: (a, b) => a.wsjf_score - b.wsjf_score,
            render: (text, record) => (
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <Typography.Text
                        style={{
                            width: '60px',
                            textAlign: 'center',
                            color: record.job_duration ? '#07A6F6' : 'red',
                            fontWeight: 'bold'
                        }}
                    >
                        {record.job_duration ? record.wsjf_score : (text || '--')}
                    </Typography.Text>
                </div>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            align: 'center',
            render: (text, record) => (
                <Button
                    type="link"
                    danger
                    icon={<DeleteOutlined/>}
                    onClick={() => removeTask(record.id)}
                />
            ),
        }
    ];

    console.log("TASK: ", task)

    return (
        <div className="centered-content" style={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
            <div style={{marginTop: '40px', flex: '1 0 auto', textAlign: 'center'}}>
                <img src="https://icons.iconarchive.com/icons/graphicloads/flat-finance/256/calculator-icon.png"
                     style={{width: '48px', height: '48px'}} alt="App Logo"/>
                <Title level={1}>WSJF Calculator</Title>

                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginBottom: '20px'}}>
                    <Button type="primary" onClick={showModal} className="main-button" icon={<SyncOutlined/>}>Fetch
                        Children</Button>
                    <div className="table-container">
                        <Table
                            className="cursor-pointer"
                            columns={columns}
                            dataSource={task}
                            rowKey="id"
                            pagination={false}
                        />
                    </div>
                    <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: "10px"}}>
                        {isShowReloadButton && (
                            <Button type="primary" danger icon={<ReloadOutlined/>}
                                    onClick={() => window.location.reload()} className="reload-button">
                            </Button>
                        )}
                    </div>
                    <Spin
                        spinning={isLoadingSubmitJira}
                        size={"large"}
                        indicator={<LoadingOutlined style={{fontSize: 24}} spin/>}
                    >
                    </Spin>
                    <div className="button-container"
                         style={{}}>
                        {isAddTaskEnabled ? (
                            <Button
                                ref={addButtonRef}
                                type="primary"
                                icon={<PlusOutlined/>}
                                className="main-button"
                                onClick={() => {
                                    if (task.length >= 10) {
                                        setIsPaywallVisible(true);
                                    } else {
                                        addTask();
                                    }
                                }}
                            >
                                Add Task
                            </Button>
                        ) : (
                            <Button
                                type="primary"
                                className="main-button"
                                icon={<FireOutlined />}
                                onClick={async () => {
                                    setIsLoadingSubmitJira(true);
                                    task.forEach((taskItem) => {
                                        if (taskItem.issue_key) {
                                            updateTask(taskItem.issue_key, taskItem.wsjf_score);
                                        }
                                    });
                                    setIsLoadingSubmitJira(false);
                                }}
                                disabled={isSubmitButtonDisabled}
                            >
                                Submit
                            </Button>
                        )}
                    </div>
                </div>
            </div>
            <Footer style={{flexShrink: '0'}}/>
            <Modal
                title="Fetch Children"
                open={isModalFetchChildrenVisible}
                onOk={handleOk}
                onCancel={handleCancelModalFetchChildren}
                cancelText={"Abort"}
                okText={"Fetch"}
                okButtonProps={{disabled: !isSubmitParentEnabled}}
                centered
                style={{textAlign: 'center'}}
            >
                <Text type="secondary" style={{fontSize: '14px', marginBottom: '20px'}}>Enter the issue key of the Jira
                    Epic or Story to fetch its children tasks.</Text>
                <Form form={form}>
                    <Form.Item
                        label="Parent Issue Key"
                        name={"parentIssueKey"}
                        rules={[
                            {required: true, message: 'Please input your Parent Issue Key!'},
                            {
                                pattern: /^[A-Za-z]{1,10}-\d{1,5}$/,
                                message: 'Parent Issue Key should start with 1-10 alphabets followed by a dash and then 1-5 numbers. Example: KHO-12345'
                            }
                        ]}
                    >
                        <Input
                            type="text"
                            name="parentIssueKey"
                            placeholder="KHO-394"
                            onChange={(e) => {
                                setParentDetail(null);
                                setIsIssueKeyParentNotFound(false);
                                setIsRemoveErrorMessage(true);
                                setIsSubmitParentEnabled(false)
                                const upperCaseValue = e.target.value.toUpperCase();
                                form.setFieldsValue({parentIssueKey: upperCaseValue});
                            }}
                            suffix= {parentDetail?.summary && !isIssueKeyParentNotFound && !isCheckingParentIsError ? (
                                <CheckCircleOutlined style={{ color: 'green' }} />
                            ) : (
                                <Button
                                    type="primary"
                                    loading={isLoadingFetchingChildren}
                                    onClick={async () => {
                                        setIsRemoveErrorMessage(false);
                                        const issueKey = form.getFieldValue('parentIssueKey');
                                        await checkParentIssueKey(issueKey);
                                    }}
                                >
                                    Check
                                </Button>
                            )}
                        />
                    </Form.Item>
                </Form>
                {!isRemoveErrorMessage &&
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '20px'}}>
                        {isCheckingParentIsError && <Text type="danger">Issue type should be a Epic or Story</Text>}
                        {isIssueKeyParentNotFound && <Text type="danger">Given Issue Key not found</Text>}
                        {parentDetail?.summary && (parentDetail.issuetype.id === "10001" ?
                            <Story16Icon className="issue-type-icon-style"/> :
                            <Epic16Icon className="issue-type-icon-style"/>)}
                        {parentDetail && <Text strong style={{
                            marginLeft: "10px",
                            fontSize: '12px'
                        }}>{parentDetail?.key}: {parentDetail?.summary}</Text>}
                    </div>}
            </Modal>
            <Modal
                wrapClassName="custom-modal"
                title={<div className="modal-title">Continue Calculating?</div>}
                open={isPaywallVisible}
                onCancel={() => setIsPaywallVisible(false)}
                width="70%"
                footer={null}
            >
                <p className="modal-subtitle">Get Unlimited digital access free for one month Unlimited Digital
                    Access</p>
                <Button
                    type="primary"
                    className="free-trial-button"
                    onClick={() => setIsPaymentModalVisible(true)}
                >
                    Start Your Free Trial
                </Button>
                <a className="login-link" onClick={() => setIsPaywallVisible(false)}>
                    Already a subscriber? Login
                </a>
            </Modal>
            <Modal
                wrapClassName="custom-modal"
                title={<div className="modal-title">Payment Information</div>}
                open={isPaymentModalVisible}
                onCancel={() => {
                    form.resetFields();
                    setIsPaymentModalVisible(false);
                }}
                width="70%"
                footer={null}
            >
                <p className="modal-payment-subtitle">Make Your payment securely through your bank account</p>
                <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '10px'}}>
                    <img src="/mastercard.png" alt="Visa"
                         style={{width: '55px', height: '40px', marginRight: '10px'}}/>
                    <img src="/maestro.png" alt="Maestro"
                         style={{width: '55px', height: '40px', marginRight: '10px'}}/>
                    <img src="https://www.svgrepo.com/show/266068/american-express.svg" alt="MasterCard"
                         style={{width: '55px', height: '40px', marginRight: '10px'}}/>
                    <img src="/visa.png" alt="Other" style={{width: '55px', height: '40px'}}/>
                </div>
                <Form layout="vertical" style={{marginTop: '20px'}}
                      onFinish={() => {
                          setIsSubmitting(true);
                          setIsSubmitModalVisible(true);
                          setIsFormValid(true);
                      }}
                      onFinishFailed={() => setIsFormValid(false)}
                      form={form}
                >
                    <Form.Item
                        label="Cardholders Name"
                        name={"card-holder-name"}
                        rules={[
                            {required: true, message: 'Please input your cardholder name!'},
                            {
                                pattern: /^[A-Za-z\s]{1,40}$/,
                                message: 'Name should only contain alphabets and spaces, max 40 characters'
                            }
                        ]}
                    >
                        <Input type="text" name="card-holder-name" placeholder="Kevin Archie"/>
                    </Form.Item>
                    <Form.Item
                        label="Card Number"
                        rules={[{required: true, message: 'Please input your card number!'}]}
                    >
                        <Input
                            type="text"
                            label="Card Number"
                            placeholder="0777 9436 5342 0091"
                            maxLength={19}
                            value={cardNumber}
                            onChange={(e) => {
                                const formattedValue = formatCardNumber(e.target.value);
                                setCardNumber(formattedValue);
                            }}
                        />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Expiry Date">
                                <Row gutter={8}>
                                    <Col span={12}>
                                        <Select placeholder="Select year" name="expiry-year" defaultValue={currentYear}
                                                onChange={(value) => {
                                                    setSelectedYear(value);
                                                    if (value < currentYear || (value === currentYear && selectedMonth < currentMonthIndex)) {
                                                        setIsDateValid(false);
                                                    } else {
                                                        setIsDateValid(true);
                                                    }
                                                    if (value > currentYear) {
                                                        setSelectedMonth(0);
                                                    } else {
                                                        setSelectedMonth(currentMonthIndex);
                                                    }
                                                }}>
                                            {years.map((year, index) => (
                                                <Option key={index} value={year}>{year}</Option>
                                            ))}
                                        </Select>
                                    </Col>
                                    <Col span={12}>
                                        <Select placeholder="Select month" name="expiry-month"
                                                defaultValue={currentMonth} onChange={(value) => {
                                            const selectedMonthIndex = months.indexOf(value);
                                            setSelectedMonth(selectedMonthIndex);
                                            if (selectedYear === currentYear && selectedMonthIndex < currentMonthIndex) {
                                                setSelectedMonth(currentMonthIndex);
                                                setIsDateValid(false);
                                            } else {
                                                setIsDateValid(true);
                                            }
                                        }}>
                                            {availableMonths.map((month, index) => (
                                                <Option key={index} value={month}>{month}</Option>
                                            ))}
                                        </Select>
                                    </Col>
                                </Row>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="CVV"
                                name={"cvv"}
                                rules={[
                                    {required: true, message: 'Please input your CVV!'},
                                    {pattern: /^\d{3}$/, message: 'CVV should be exactly 3 digits'}
                                ]}
                            >
                                <Input type="text" name="cvv" placeholder="099"/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item>
                        <Button type="primary" onClick={() => form.submit()} disabled={isSubmitParentEnabled}>
                            {isSubmitting ? 'Processing...' : 'Submit'}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Robbering..."
                open={isSubmitModalVisible}
                onCancel={() => {
                    setIsSubmitModalVisible(false);
                    setIsSubmitting(false);
                }}
                footer={null}
            >
                <iframe src="https://giphy.com/embed/j4wrsOnwaAhjgMsC1g" width="480" height="270" frameBorder="0"
                        className="giphy-embed" allowFullScreen></iframe>
                <a href="https://giphy.com/gifs/adweek-heist-bank-robbery-quibi-j4wrsOnwaAhjgMsC1g"></a>
            </Modal>
        </div>
    );
}
