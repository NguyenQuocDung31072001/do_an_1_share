import { MehOutlined, SmileOutlined } from '@ant-design/icons'
import {
  Button,
  Input,
  DatePicker,
  Space,
  Select,
  Form,
  InputNumber,
  Row,
  Col,
  notification,
  Spin
} from 'antd'
import { useForm } from 'antd/lib/form/Form'
import moment from 'moment'
import React, { useState, useEffect } from 'react'
import {
  addBook,
  getAllGenresForAddBook,
  getAllAuthorForAddBook
} from '../redux/api_request'
import { openNotification } from '../utils/notification'
const { TextArea } = Input
const { Option } = Select
function AddBook() {
  const [imageBook, setImageBook] = useState()
  const [nameBook, setNameBook] = useState()
  const [pushlishBy, setPushlishBy] = useState()
  const [page, setPage] = useState()
  const [amount, setAmount] = useState()
  const [pushlishDate, setPushlishDate] = useState()
  const [author, setAuthor] = useState()
  const [price, setPrice] = useState()
  const [genre, setGenre] = useState()
  const [decription, setDecription] = useState()
  const [imageBase64, setImageBase64] = useState()
  const [allGenres, setAllGenres] = useState([])
  const [allAuthor, setAllAuthor] = useState([])

  const [allGenresData, setAllGenresData] = useState([])
  const [allAuthorsData, setAllAuthorsData] = useState([])
  const [loading, setLoading] = useState(false)

  const date = new Date()
  const defaultDate =
    date.getFullYear() + '-' + `${date.getMonth() + 1}` + '-' + date.getDate()

  const changeImageBook = e => {
    // console.log(e.target.files[0])
    setImageBook(e.target.files[0])
  }
  useEffect(() => {
    const getAllGenresFnc = async () => {
      const allGenre = await getAllGenresForAddBook()
      const allGenreName = []
      for (let i = 0; i < allGenre.length; i++) {
        allGenreName.push(allGenre[i].name)
      }
      setAllGenres(allGenreName)
      setAllGenresData(allGenre)
    }
    const getAllAuthorFnc = async () => {
      const allAuthor = await getAllAuthorForAddBook()
      const allAuthorName = []
      for (let i = 0; i < allAuthor.length; i++) {
        allAuthorName.push(allAuthor[i].fullName)
      }
      setAllAuthor(allAuthorName)
      setAllAuthorsData(allAuthor)
    }
    getAllGenresFnc()
    getAllAuthorFnc()
  }, [])

  // useEffect(() => {
  //   console.log(allAuthor)
  // }, [allAuthor])

  useEffect(() => {
    if (imageBook) {
      const reader = new FileReader()
      reader.readAsDataURL(imageBook)
      reader.onloadend = () => {
        // console.log(reader.result)
        setImageBase64(reader.result)
      }
      reader.onerror = () => {
        console.error('AHHHHHHHH!!')
      }
    }
  }, [imageBook])

  const handleAddBook = () => {
    let book = {
      base64Image: imageBase64,
      name: nameBook,
      publishedBy: pushlishBy,
      pages: page,
      amount: amount,
      // pushlishDate: pushlishDate,
      authors: author,
      price: price,
      genres: genre,
      description: decription
    }
    // console.log(book)
    addBook(book)
    // console.log(book)
  }

  const [form] = useForm()

  const handleSubmit = () => {
    form.submit()
  }

  const createNewBookHandler = async data => {
    if (!imageBook || !imageBase64) {
      openNotification(
        'error',
        'Th??m kh??ng th??nh c??ng!',
        '???nh b??a c???a s??ch kh??ng ???????c b??? tr???ng, b???n vui l??ng ch???n ???nh b??a cho s??ch tr?????c khi ti???p t???c!'
      )
      return
    }
    setLoading(true)
    let book = {
      base64Image: imageBase64,
      name: data.name,
      genres: allGenresData.find(genre => genre._id === data.genre)?._id,
      authors: allAuthorsData.find(author => author._id === data.author)?._id,
      description: data.description,
      format: 1,
      language: '6229dc343a2e43c8cd9dbd65',
      pages: data.pages,
      publishedBy: data.publishedBy,
      publishedDate: data.publishedDate.format('YYYY-MM-DD'),
      price: data.price
    }

    const result = await addBook(book)
    if (result.success) {
      setLoading(false)
      openNotification(
        'success',
        'Th??m th??nh c??ng!',
        'Th??ng tin s??ch ???? th??m th??nh c??ng v??o h??? th???ng!'
      )
    } else {
      setLoading(false)
      openNotification(
        'error',
        'Th??m kh??ng th??nh c??ng!',
        'C?? l???i x???y ra khi th??m s??ch m???i, b???n vui l??ng ki???m tra l???i th??ng tin s??ch v?? k???t n???i m???ng c???a b???n!'
      )
    }
  }

  return (
    <div>
      <div className="w-full flex flex-col justify-center items-center">
        <div className=" w-full flex justify-center px-4 pt-4  border-b-[1px] border-solid border-gray-300">
          <p className="px-4 text-3xl font-medium ">Th??m s??ch</p>
        </div>
        <div className="flex pt-[100px]">
          <div className="flex justify-center w-[350px]  h-[450px] rounded-lg shadow-xl bg-gray-50 border-dashed border-2">
            <div className="">
              <label className="inline-block mb-2 text-gray-500">
                T???i ???nh l??n
              </label>
              <div className="flex items-center justify-center w-full">
                {imageBook && (
                  <img src={URL.createObjectURL(imageBook)} alt="" />
                )}
                {!imageBook && (
                  <label className="flex flex-col w-full h-[350px] border-4 border-blue-200 border-dashed hover:bg-gray-100 hover:border-gray-300">
                    <div className="flex flex-col items-center justify-center pt-7">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-8 h-8 text-gray-400 group-hover:text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                        Attach a file
                      </p>
                    </div>
                    <input
                      type="file"
                      className="opacity-0"
                      onChange={changeImageBook}
                    />
                  </label>
                )}
              </div>
              <Button onClick={() => setImageBook('')}>X??a ???nh</Button>
            </div>
          </div>
          <div className="w-[800px]">
            <Form
              form={form}
              name="updateBook"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              initialValues={{
                name: '',
                genre: '',
                author: '',
                description: '',
                pages: 0,
                publishedBy: '',
                publishedDate: moment(),
                price: 0
              }}
              onFinish={createNewBookHandler}
              // onFinishFailed={onFinishFailed}
              autoComplete="off"
              style={{ width: '100%' }}
            >
              <Row>
                <Col span={12}>
                  <Row>
                    <Col span={24}>
                      <Form.Item
                        label="T??n S??ch"
                        name="name"
                        rules={[
                          { required: true, message: 'Vui l??ng nh???p t??n s??ch!' }
                        ]}
                      >
                        <Input
                          style={{ width: '100%' }}
                          size="large"
                          placeholder="Nh???p t??n s??ch"
                        />
                      </Form.Item>
                    </Col>

                    <Col span={24}>
                      <Form.Item
                        label="Nh?? xu???t b???n"
                        name="publishedBy"
                        rules={[
                          {
                            required: true,
                            message: 'Vui l??ng nh???p nh?? xu???t b???n!'
                          }
                        ]}
                      >
                        <Input
                          style={{ width: '100%' }}
                          size="large"
                          placeholder="Nh???p nh?? xu???t b???n"
                        />
                      </Form.Item>
                    </Col>

                    <Col span={24}>
                      <Form.Item
                        label="Ng??y xu???t b???n"
                        name="publishedDate"
                        rules={[
                          {
                            required: true,
                            message: 'Vui l??ng nh???p Ng??y xu???t b???n!'
                          }
                        ]}
                      >
                        <DatePicker
                          style={{ width: '100%' }}
                          size="large"
                          placeholder="Nh???p ng??y xu???t b???n"
                        />
                      </Form.Item>
                    </Col>

                    <Col span={24}>
                      <Form.Item
                        label="T??c gi???"
                        name="author"
                        rules={[
                          { required: true, message: 'Vui l??ng nh???p t??c gi???!' }
                        ]}
                      >
                        {allAuthorsData.length > 0 && (
                          <Select
                            style={{ width: '100%' }}
                            size="large"
                            placeholder="Ch???n t??c gi???"
                          >
                            {allAuthorsData.map((author, key) => {
                              return (
                                <Option key={key} value={author._id}>
                                  {author.fullName}
                                </Option>
                              )
                            })}
                          </Select>
                        )}
                      </Form.Item>
                    </Col>

                    <Col span={24}>
                      <Form.Item
                        label="Th??? lo???i"
                        name="genre"
                        rules={[
                          { required: true, message: 'Vui l??ng ch???n th??? lo???i!' }
                        ]}
                      >
                        {allGenresData.length > 0 && (
                          <Select
                            style={{ width: '100%' }}
                            size="large"
                            placeholder="Ch???n th??? lo???i"
                          >
                            {allGenresData.map((genre, key) => {
                              return (
                                <Option key={key} value={genre._id}>
                                  {genre.name}
                                </Option>
                              )
                            })}
                          </Select>
                        )}
                      </Form.Item>
                    </Col>

                    <Col span={24}>
                      <Form.Item
                        label="S??? trang"
                        name="pages"
                        rules={[
                          {
                            required: true,
                            message: 'Vui l??ng nh???p s??? trang!'
                          },
                          {
                            type: 'number',
                            min: 0,
                            message: 'S??? trang ph???i >= 0'
                          }
                        ]}
                      >
                        <InputNumber
                          style={{ width: '100%' }}
                          size="large"
                          placeholder="Nh???p s??? trang"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
                <Col span={12}>
                  <Row>
                    <Col span={24}>
                      <Form.Item
                        label="Gi??"
                        name="price"
                        rules={[
                          {
                            required: true,
                            message: 'Vui l??ng nh???p gi?? d??? ki???n c???a s??ch!'
                          },
                          {
                            type: 'number',
                            min: 0,
                            message: 'Gi?? s??ch ph???i >= 0'
                          }
                        ]}
                      >
                        <InputNumber
                          style={{ width: '100%' }}
                          // disabled
                          // className="text-black"
                          size="large"
                          placeholder="Nh???p gi?? d??? ki???n"
                          addonAfter="???"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item
                        label="M?? t???"
                        name="description"
                        rules={[
                          {
                            required: true,
                            message: 'Vui l??ng nh???p gi?? d??? ki???n c???a s??ch!'
                          }
                        ]}
                      >
                        <TextArea
                          showCount
                          maxLength={500}
                          style={{ height: 300, width: '100%' }}
                          placeholder="Nh???p m?? t???"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Form>
          </div>
          {/* <div className="w-[400px] h-[450px] ml-[20px] mt-[100px]">
            <div className="flex mb-[20px]">
              <label className="w-[120px]">T??n s??ch</label>
              <Input
                placeholder="T??n s??ch"
                onChange={e => setNameBook(e.target.value)}
              />
            </div>
            <div className="flex mb-[20px]">
              <label className="w-[120px]">Nh?? xu???t b???n</label>
              <Input
                placeholder="Nh?? xu???t b???n"
                onChange={e => setPushlishBy(e.target.value)}
              />
            </div>
            <div className="flex mb-[20px]">
              <label className="w-[120px]">S??? trang</label>
              <Input
                placeholder="S??? trang"
                onChange={e => setPage(e.target.value)}
              />
            </div>
            <div className="flex mb-[20px]">
              <label className="w-[120px]">S??? l?????ng</label>
              <Input
                placeholder="S??? l?????ng"
                onChange={e => setAmount(e.target.value)}
              />
            </div>
            <div className="flex mb-[20px]">
              <label className="w-[100px]">Ng??y xu???t b???n</label>
              <DatePicker
                style={{ width: 320 }}
                defaultValue={moment(`${defaultDate}`, 'YYYY-MM-DD')}
                onChange={(date, id) => setPushlishDate(id)}
                // onChange={(date,id)=>console.log(id)}
              />
            </div>
          </div>
          <div className="w-[400px] h-[450px] ml-[20px] mt-[100px]">
            <div className="flex mb-[20px]">
              <label className="w-[100px]">T??c gi???</label>

              {allAuthor.length > 0 && (
                <Select
                  // defaultValue={allAuthor[0]}
                  style={{ width: 320 }}
                  onChange={e => setAuthor(e)}
                >
                  {allAuthor.map((author, key) => {
                    return (
                      <Option key={key} value={author}>
                        {author}
                      </Option>
                    )
                  })}
                </Select>
              )}
            </div>
            <div className="flex mb-[20px]">
              <label className="w-[120px]">Gi??</label>
              <Input
                placeholder="Gi??"
                onChange={e => setPrice(e.target.value)}
              />
            </div>
            <div className="flex mb-[20px]">
              <label className="w-[100px]">Th??? lo???i</label>
              {allGenres.length > 0 && (
                <Select
                  // defaultValue={allGenres[0]}
                  style={{ width: 320 }}
                  onChange={e => setGenre(e)}
                >
                  {allGenres.map((genre, key) => {
                    return (
                      <Option key={key} value={genre}>
                        {genre}
                      </Option>
                    )
                  })}
                </Select>
              )}
            </div>
            <div className="flex mb-[20px]">
              <label className="w-[100px]">M?? t???</label>
              <TextArea
                showCount
                maxLength={100}
                style={{ height: 120, width: 320 }}
                onChange={e => setDecription(e.target.value)}
              />
            </div>
          </div> */}
        </div>
      </div>
      <div>
        <Button
          onClick={handleSubmit}
          type="primary"
          size="large"
          disabled={loading}
        >
          {loading && <Spin style={{ marginRight: '10px' }} />}
          Th??m s??ch
        </Button>
      </div>
    </div>
  )
}

export default AddBook
