import React, { useEffect, useState } from 'react'
import {
  Modal,
  Button,
  Input,
  DatePicker,
  Select,
  Tooltip,
  InputNumber,
  Form
} from 'antd'
import moment from 'moment'
import {
  getAllAuthorForAddBook,
  getAllGenresForAddBook,
  updateBook
} from '../redux/api_request'
import { PATH_NAME } from '../config/pathName'
import { EditOutlined } from '@ant-design/icons'
const { TextArea } = Input
const { Option } = Select
export default function UpdateBookAdmin({ book, onSuccess, onError }) {
  // console.log(book)
  const [imageBook, setImageBook] = useState(null)
  const [nameBook, setNameBook] = useState('')
  const [publishedBy, setPublishedBy] = useState('')
  const [page, setPage] = useState('')
  const [amount, setAmount] = useState('')
  const [publishedDate, setPublishedDate] = useState('')
  const [author, setAuthor] = useState('')
  const [price, setPrice] = useState('')
  const [genre, setGenre] = useState('')
  const [description, setDescription] = useState('')
  const [imageBase64, setImageBase64] = useState(null)
  const [allGenres, setAllGenres] = useState([])
  const [allAuthor, setAllAuthor] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)

  const [allGenresData, setAllGenresData] = useState([])
  const [allAuthorsData, setAllAuthorsData] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setNameBook(book.name)
    setAuthor(book.authors[0]?.fullName)
    setGenre(book.genres[0]?.name)
    setDescription(book.description)
    setPage(book.pages)
    setPublishedBy(book.publishedBy)
    setPublishedDate(book.publishedDate.split('T')[0])
    setAmount(book.amount)
    setPrice(book.price)
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
    return () => {
      setNameBook('')
      setAuthor('')
      setGenre('')
      setDescription('')
      setPage('')
      setPublishedBy('')
      setPublishedDate('')
      setAmount('')
      setPrice('')
    }
  }, [book])
  const showModal = () => {
    setIsModalVisible(true)
  }
  const handleOk = () => {
    setIsModalVisible(false)
    ;(function () {
      const bookData = {
        id: book._id,
        name: nameBook,
        genres: genre,
        authors: author,
        description: description,
        format: 1,
        language: '6229dc343a2e43c8cd9dbd65',
        pages: page,
        publishedBy: publishedBy,
        publishedDate: publishedDate,
        amount: amount,
        price: price,
        base64Image: imageBase64
      }
      ;(async function () {
        await updateBook(bookData)
        window.location.reload()
      })()
    })()
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }
  const changeImageBook = e => {
    setImageBook(e.target.files[0])

    const reader = new FileReader()
    reader.readAsDataURL(e.target.files[0])
    reader.onloadend = () => {
      setImageBase64(reader.result)
    }
    reader.onerror = () => {
      console.error('AHHHHHHHH!!')
    }
  }

  const createNewBookHandler = async data => {
    setLoading(true)
    const bookData = {
      id: book._id,
      name: data.name,
      genres: allGenresData.find(genre => genre._id === data.genre)?._id,
      authors: allAuthorsData.find(author => author._id === data.author)?._id,
      description: data.description,
      format: 1,
      language: '6229dc343a2e43c8cd9dbd65',
      pages: data.pages,
      publishedBy: data.publishedBy,
      publishedDate: data.publishedDate,
      // amount: amount,
      // price: price,
      base64Image: imageBase64
    }
    const result = await updateBook(bookData)
    if (result.success) {
      setLoading(false)
      if (onSuccess) onSuccess(result.book)
      handleCancel()
    } else {
      setLoading(false)
      if (onError)
        onError(
          'C???p nh???t kh??ng th??nh c??ng!',
          'B???n vui l??ng ki???m tra l???i th??ng tin s??ch v?? k???t n???i c???a b???n!'
        )
    }
  }

  const [form] = Form.useForm()

  const handleSubmit = () => {
    form.submit()
  }

  useEffect(() => {
    form.setFieldsValue({
      name: book.name,
      genre: book.genres[0]?._id,
      author: book.authors[0]?._id,
      description: book.description,
      pages: book.pages,
      publishedBy: book.publishedBy,
      publishedDate: moment(publishedDate, 'DD-MM-YYYY'),
      amount: book.amount,
      price: book.price
    })
  }, [book])

  return (
    <>
      <Tooltip title=" Ch???nh s???a s??ch">
        <Button shape="circle" icon={<EditOutlined />} onClick={showModal} />
      </Tooltip>
      <Modal
        title="Ch???nh s???a s??ch"
        width={900}
        style={{ marginBottom: 40 }}
        visible={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
      >
        <div className="flex flex-row items-stretch relative px-5">
          <div className="flex justify-start items-start object-cover overflow-hidden w-[350px] ">
            <label className="flex flex-col w-full h-[350px] cursor-pointer">
              <div className="flex flex-col items-center justify-center">
                {imageBook && (
                  <img
                    className="w-full h-full object-cover"
                    src={URL.createObjectURL(imageBook)}
                    alt=""
                  />
                )}
                {!imageBook && (
                  <img
                    className="w-full h-full object-cover"
                    src={book.coverUrl}
                    alt=""
                  />
                )}
              </div>
              <input
                type="file"
                className="opacity-0"
                onChange={changeImageBook}
              />
            </label>
          </div>
          <div className="w-[calc(100%-350px)]">
            <Form
              form={form}
              name="updateBook"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              initialValues={{
                name: book.name,
                genre: book.genres[0]?._id,
                author: book.authors[0]?._id,
                description: book.description,
                pages: book.pages,
                publishedBy: book.publishedBy,
                publishedDate: moment(publishedDate, 'DD-MM-YYYY'),
                amount: book.amount,
                price: book.price
              }}
              onFinish={createNewBookHandler}
              // onFinishFailed={onFinishFailed}
              autoComplete="off"
              style={{ width: '100%' }}
            >
              <Form.Item
                label="T??n S??ch"
                name="name"
                rules={[{ required: true, message: 'Vui l??ng nh???p t??n s??ch!' }]}
              >
                <Input style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item
                label="Nh?? xu???t b???n"
                name="publishedBy"
                rules={[
                  { required: true, message: 'Vui l??ng nh???p nh?? xu???t b???n!' }
                ]}
              >
                <Input style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item
                label="Ng??y xu???t b???n"
                name="publishedDate"
                rules={[
                  { required: true, message: 'Vui l??ng nh???p Ng??y xu???t b???n!' }
                ]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item
                label="T??c gi???"
                name="author"
                rules={[{ required: true, message: 'Vui l??ng nh???p t??c gi???!' }]}
              >
                {allAuthorsData.length > 0 && (
                  <Select style={{ width: '100%' }}>
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

              <Form.Item
                label="Th??? lo???i"
                name="genre"
                rules={[{ required: true, message: 'Vui l??ng ch???n th??? lo???i!' }]}
              >
                {allGenresData.length > 0 && (
                  <Select style={{ width: '100%' }}>
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

              <Form.Item
                label="S??? trang"
                name="pages"
                rules={[
                  { required: true, message: 'Vui l??ng nh???p s??? trang!' },
                  { type: 'number', min: 0, message: 'S??? trang ph???i >= 0' }
                ]}
              >
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item
                label="S??? l?????ng"
                name="amount"
                rules={[
                  {
                    required: true,
                    message: 'Vui l??ng nh???p gi?? d??? ki???n c???a s??ch!'
                  },
                  { type: 'number', min: 0, message: 'Gi?? s??ch ph???i >= 0' }
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  disabled
                  className="text-black"
                />
              </Form.Item>

              <Form.Item
                label="Gi??"
                name="price"
                rules={[
                  {
                    required: true,
                    message: 'Vui l??ng nh???p gi?? d??? ki???n c???a s??ch!'
                  },
                  { type: 'number', min: 0, message: 'Gi?? s??ch ph???i >= 0' }
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  disabled
                  className="text-black"
                />
              </Form.Item>

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
                  maxLength={100}
                  style={{ height: 120, width: '100%' }}
                />
              </Form.Item>
            </Form>
          </div>
          {/* <div className="w-[400px] ml-[20px]">
            <div className="flex mb-[20px]">
              <label className="w-[120px]">T??n s??ch</label>
              <Input
                placeholder="T??n s??ch"
                value={nameBook}
                onChange={e => setNameBook(e.target.value)}
              />
            </div>
            <div className="flex mb-[20px]">
              <label className="w-[120px]">Nh?? xu???t b???n</label>
              <Input
                placeholder="Nh?? xu???t b???n"
                value={publishedBy}
                onChange={e => setPublishedBy(e.target.value)}
              />
            </div>
            <div className="flex mb-[20px]">
              <label className="w-[120px]">S??? trang</label>
              <Input
                placeholder="S??? trang"
                value={page}
                onChange={e => setPage(e.target.value)}
              />
            </div>
            <div className="flex mb-[20px]">
              <label className="w-[120px]">S??? l?????ng</label>
              <Input
                placeholder="S??? l?????ng"
                value={amount}
                onChange={e => setAmount(e.target.value)}
              />
            </div>
            <div className="flex mb-[20px]">
              <label className="w-[100px]">Ng??y xu???t b???n</label>
              <DatePicker
                style={{ width: 320 }}
                defaultValue={moment(`${publishedDate}`, 'YYYY-MM-DD')}
                onChange={(date, id) => setPublishedDate(id)}
              />
            </div>
            <div className="flex mb-[20px]">
              <label className="w-[100px]">T??c gi???</label>

              {allAuthor.length > 0 && (
                <Select
                  // defaultValue={allAuthor[0]}
                  defaultValue={author}
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
                value={price}
                onChange={e => setPrice(e.target.value)}
              />
            </div>
            <div className="flex mb-[20px]">
              <label className="w-[100px]">Th??? lo???i</label>
              {allGenres.length > 0 && (
                <Select
                  // defaultValue={allGenres[0]}
                  defaultValue={genre}
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
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>
          </div> */}
        </div>
      </Modal>
    </>
  )
}
