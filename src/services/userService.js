import http from './http-commons';
import urlencode from 'urlencode';

class UserService {
  userLogin(data) {
    return http.post('/auth/login', data);
  }

  getAllUsers() {
    return http.get('/user/');
  }

  getUser(id) {
    return http.get(`/user/${id}`);
  }

  createUser(data) {
    return http.post('/user', data);
  }


  getHourlyPaymentByFreelancer(freelancerId, contractId){
    return http.get(`/project/get_freelancer_hourly_payment/fid/${freelancerId}/contractId/${contractId}`)
  }
  
  getActivies(index, workbookId){
    return http.get(`/project/get_activity/index/${index}/workbookId/${workbookId}`)
  }
  addTimeManually(data) {
    return http.post('/project/add_manual_hours_tracked', data);
  }
  addTimeAutomatically(data) {
    return http.put('/project/auto_hours_tracked', data);
  }
  createWorkBook(data) {
    return http.post('/project/create_workbook', data);
  }
  
  checkWkBook(logged_date){
    return http.get(`/project/get_workbook/today/${logged_date}`)
  }

  
  updateTimeManually(data) {
    return http.put('/project/update_manual_hours_tracked', data);
  }
  deleteTimeManually(index, workbookId){
    return http.get(`/project/delete_manual_entry/index/${index}/workbookId/${workbookId}`)
  }
  

}

export default new UserService();
