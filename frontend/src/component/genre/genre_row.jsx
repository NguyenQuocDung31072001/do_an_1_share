import { useState } from 'react'
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import {
  createNewGenre,
  softDeleteGenre,
  updateGenre
} from '../../redux/api_request'
import { Modal } from 'antd'
import { openNotification } from '../../utils/notification'
function GenreRow(data) {
  const { genre, removeInsertRow, className } = data
  const [defaultData, setDefaultData] = useState(genre)
  const [name, setName] = useState(genre ? genre.name : '')
  const [description, setDescription] = useState(genre ? genre.description : '')
  const [isEditing, setIsEditing] = useState(genre ? false : true)
  const [required, setRequired] = useState(false)
  const dispatch = useDispatch()
  const { confirm } = Modal

  const DeleteGenre = async () => {
    confirm({
      title: 'Xác nhận xóa',
      icon: <ExclamationCircleOutlined />,
      content: 'Dữ liệu về thể loại sẽ bị xóa! Bạn có muốn tiếp tục',
      okText: 'Tiếp tục',
      cancelText: 'Hủy',
      onOk() {
        const handleDelete = async () => {
          const result = await softDeleteGenre(dispatch, genre)
          openNotification(
            'success',
            'Xóa thành công!',
            'Thông tin thể loại đã được xóa thành công!'
          )
        }
        handleDelete()
      },
      onCancel() {
        console.log('Cancel')
      }
    })
  }

  const CancelEdit = () => {
    if (defaultData && genre) {
      setName(defaultData.name)
      setDescription(defaultData.description)
      setIsEditing(false)
    } else if (removeInsertRow) {
      removeInsertRow()
    }
  }

  const Edit = () => {
    setIsEditing(true)
  }

  const SaveEdit = async () => {
    setRequired(true)
    if (name && description) {
      if (genre) {
        const result = await updateGenre(dispatch, {
          _id: genre._id,
          name: name,
          description: description
        })
        if (result) {
          setIsEditing(false)
          const newDefaultData = {
            name: result.name,
            description: result.description
          }
          setDefaultData(newDefaultData)
          openNotification(
            'success',
            'Cập nhật thành công!',
            'Thông tin thể loại đã được cập nhật thành công!'
          )
        }
      } else {
        const newGenre = {
          name: name,
          description: description
        }
        const result = await createNewGenre(dispatch, newGenre)
        if (removeInsertRow) {
          removeInsertRow()
        }
        openNotification(
          'success',
          'Thêm thành công',
          'Thông tin thể loại đã được thêm thành công!'
        )
      }
    }
    //send save request
  }

  return (
    <>
      <tr className="hover:bg-slate-100">
        <td className="border">
          <div className="flex flex-row justify-evenly items-center space-x-1 text-lg">
            {isEditing ? (
              <button onClick={SaveEdit}>
                <CheckOutlined style={{ color: '#4D96FF' }} />
              </button>
            ) : (
              <button onClick={Edit}>
                <EditOutlined style={{ color: '#4D96FF' }} />
              </button>
            )}

            {isEditing ? (
              <button onClick={CancelEdit}>
                <CloseOutlined style={{ color: '#FF6B6B' }} />
              </button>
            ) : (
              <button onClick={DeleteGenre}>
                <DeleteOutlined style={{ color: '#FF6B6B' }} />
              </button>
            )}
          </div>
        </td>
        <td className="border text-base text-gray-700 font-normal py-2 px-2 text-left">
          {genre ? genre._id : ''}
        </td>
        <td className="border text-base text-gray-700 font-normal py-2 px-2">
          <input
            type="text"
            name="name"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Tên thể loại"
            disabled={!isEditing}
            className={`disabled:bg-transparent bg-white px-2 py-[0.4rem] w-full text-left border-0 rounded-sm outline-none disabled:ring-0 ring-1 ${
              required && !name && 'ring-red-500'
            }`}
            required
          />
        </td>
        <td className="border text-base py-2 px-2">
          <input
            type="text"
            name="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Mô tả"
            disabled={!isEditing}
            className={`disabled:bg-transparent bg-white px-2 py-[0.4rem] w-full text-left border-0 rounded-sm outline-none disabled:ring-0 ring-1 ${
              required && !description && 'ring-red-500'
            }`}
            required
          />
        </td>
      </tr>
    </>
  )
}

export default GenreRow
