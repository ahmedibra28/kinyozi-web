import React, { useState, useEffect, FormEvent } from 'react'
import dynamic from 'next/dynamic'
import withAuth from '../../HOC/withAuth'
import { useForm } from 'react-hook-form'
import { Spinner, Pagination, Message, Search, Meta } from '../../components'
import { DynamicFormProps, inputMultipleCheckBox } from '../../utils/dForms'
import FormView from '../../components/FormView'
import { FaClock } from 'react-icons/fa'
import moment from 'moment'
import apiHook from '../../api'
import { IProfile } from '../../models/Profile'

const Barbershops = () => {
  const [page, setPage] = useState(1)
  const [id, setId] = useState<any>(null)
  const [edit, setEdit] = useState(false)
  const [q, setQ] = useState('')

  const getApi = apiHook({
    key: ['barbershops'],
    method: 'GET',
    url: `barbershops?page=${page}&q=${q}&limit=${25}`,
  })?.get

  const updateApi = apiHook({
    key: ['barbershops'],
    method: 'PUT',
    url: `barbershops`,
  })?.put

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({})

  useEffect(() => {
    if (updateApi?.isSuccess) {
      formCleanHandler()
      getApi?.refetch()
    }
    // eslint-disable-next-line
  }, [updateApi?.isSuccess])

  useEffect(() => {
    getApi?.refetch()
    // eslint-disable-next-line
  }, [page])

  useEffect(() => {
    if (!q) getApi?.refetch()
    // eslint-disable-next-line
  }, [q])

  const searchHandler = (e: FormEvent) => {
    e.preventDefault()
    getApi?.refetch()
    setPage(1)
  }

  const editHandler = (item: IProfile) => {
    setId(item._id)
    item?.businessHours?.forEach((item) => {
      setValue(
        item.day,
        item?.hours?.map((h) => `${item.day}_${h}`)
      )
    })
    setEdit(true)
  }

  const name = 'Barbershops List'
  const label = 'Barbershop'
  const modal = 'barbershop'

  // FormView
  const formCleanHandler = () => {
    reset()
    setEdit(false)
  }

  const days = [
    'Saturday',
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
  ]

  const submitHandler = (data: any) => {
    const businessHours = []

    for (let i = 0; i < days.length; i++) {
      const day = days[i]
      if (data[day]) {
        businessHours.push({
          day,
          hours: data[day]?.map((i: string) => i.split('day_')[1]),
        })
      }
    }

    updateApi?.mutateAsync({
      _id: id,
      businessHours,
    })
  }

  const form = [
    days.map((item) => (
      <div className="col-lg-4 col-md-4 col-6" key={item}>
        {inputMultipleCheckBox({
          register,
          errors,
          label: item,
          name: item,
          isRequired: false,
          data: [
            { _id: `${item}_08 - 09`, name: `08 - 09` },
            { _id: `${item}_09 - 10`, name: `09 - 10` },
            { _id: `${item}_10 - 11`, name: `10 - 11` },
            { _id: `${item}_11 - 12`, name: `11 - 12` },
            { _id: `${item}_12 - 13`, name: `12 - 13` },
            { _id: `${item}_13 - 14`, name: `13 - 14` },
            { _id: `${item}_14 - 15`, name: `14 - 15` },
            { _id: `${item}_15 - 16`, name: `15 - 16` },
            { _id: `${item}_16 - 17`, name: `16 - 17` },
            { _id: `${item}_17 - 18`, name: `17 - 18` },
            { _id: `${item}_18 - 19`, name: `18 - 19` },
            { _id: `${item}_19 - 20`, name: `19 - 20` },
            { _id: `${item}_20 - 21`, name: `20 - 21` },
            { _id: `${item}_21 - 22`, name: `21 - 22` },
            { _id: `${item}_22 - 23`, name: `22 - 23` },
          ],
          hasLabel: true,
        } as DynamicFormProps)}
      </div>
    )),
  ]

  const modalSize = 'modal-md'

  return (
    <>
      <Meta title="Barbershops" />

      {updateApi?.isSuccess && (
        <Message
          variant="success"
          value={`${label} has been updated successfully.`}
        />
      )}
      {updateApi?.isError && (
        <Message variant="danger" value={updateApi?.error} />
      )}

      <div className="ms-auto text-end">
        <Pagination data={getApi?.data} setPage={setPage} />
      </div>

      <FormView
        edit={edit}
        formCleanHandler={formCleanHandler}
        form={form}
        isLoadingUpdate={updateApi?.isLoading}
        isLoadingPost={updateApi?.isLoading}
        handleSubmit={handleSubmit}
        submitHandler={submitHandler}
        modal={modal}
        label={label}
        modalSize={modalSize}
      />

      {getApi?.isLoading ? (
        <Spinner />
      ) : getApi?.isError ? (
        <Message variant="danger" value={getApi?.error} />
      ) : (
        <div className="table-responsive bg-light p-3 mt-2">
          <div className="d-flex align-items-center flex-column mb-2">
            <h3 className="fw-light text-muted">
              {name}
              <sup className="fs-6"> [{getApi?.data?.total}] </sup>
            </h3>
            <button
              className="btn btn-outline-primary btn-sm shadow my-2"
              data-bs-toggle="modal"
              data-bs-target={`#${modal}`}
            >
              Add New {label}
            </button>
            <div className="col-auto">
              <Search
                placeholder="Search by name"
                setQ={setQ}
                q={q}
                searchHandler={searchHandler}
              />
            </div>
          </div>
          <table className="table table-sm table-border">
            <thead className="border-0">
              <tr>
                <th>Name</th>
                <th>Mobile</th>
                <th>Address</th>
                <th>Barbers#</th>
                <th>DateTime</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {getApi?.data?.data?.map((item: IProfile, i: number) => (
                <tr key={i}>
                  <td>{item?.name}</td>
                  <td>{item?.mobile}</td>
                  <td>{item?.address}</td>
                  <td>{item?.numberOfBarbers}</td>
                  <td>{moment(item?.createdAt).format('lll')}</td>
                  <td>
                    <div className="btn-group">
                      <button
                        className="btn btn-outline-primary btn-sm rounded mx-1"
                        onClick={() => editHandler(item)}
                        data-bs-toggle="modal"
                        data-bs-target={`#${modal}`}
                      >
                        <FaClock /> Hours
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

export default dynamic(() => Promise.resolve(withAuth(Barbershops)), {
  ssr: false,
})
