import React from 'react'
import StaticFile from './StaticFile'
class Form extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            file: '',
            form:this.props.form
        }
       this.handleProfilePicture=this.handleProfilePicture.bind(this)
       this.onSelectDialog=this.onSelectDialog.bind(this)
    }


    handleProfilePicture({
                             target: {
                                 validity,
                                 files: [file]
                             }
                         }) {
        if (validity.valid) {
            this.props.onSelectFile({...this.props.form,file,file_name:file.name})
            this.props.isPayable()
            StaticFile.setFile(file)
        }
    }

    onSelectDialog(e) {
        e.preventDefault()
        document.getElementById('myFileInput').click()

    }
    render() {
        const {name, fee, file_name, value} = this.props.form

        return (
            <tr>
                <td>{name}</td>
                <td>{fee}</td>
                <td>{file_name}</td>
                <td>
                    <input type="file" id="myFileInput" name="upload" style={{display: 'none'}}
                           onChange={this.handleProfilePicture}
                           accept="application/pdf" />
                    <button className="btn btn-sm btn-dark" onClick={this.onSelectDialog}><span><i className="fa fa-file"></i></span></button>
                </td>

            </tr>
        )
    }
}

export default Form