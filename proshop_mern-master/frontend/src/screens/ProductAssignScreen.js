import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Typeahead } from 'react-bootstrap-typeahead';
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { saveJudgesForAProduct } from '../actions/productActions'
import { listUsers, usersRelatedToProduct } from '../actions/userActions';
import { LoadingUserState } from '../reducers/userReducers';

const ProductAssignScreen = ({ match, history }) => {
  const productId = match.params.id;

  const loadingUserState = useSelector((state) => state.loadingUserState);
  const userList = useSelector((state) => state.userList);
  const { users } = userList;

  const judgeDataSource = (users || [])
    .filter(u => !u.isAdmin)
    .map(u => ({ id: u._id, name: u.name }));

  const usersRelatedToProductState = useSelector((state) => state.usersRelatedToProduct);
  const judges = usersRelatedToProductState.users;

  let selectedJudges = [];
  if (judgeDataSource.length > 0 && judges.length > 0) {
    selectedJudges = judges.map(id => {
      const correspondingJudgeInDataSource = judgeDataSource.find(j => j.id === id);
      return correspondingJudgeInDataSource;
    });
  }

  const selectJudge = (justSelectedJudges) => {
    selectedJudges.length = 0;
    selectedJudges.push(...justSelectedJudges);
  }

  const dispatch = useDispatch()

  const productDetails = useSelector((state) => state.productDetails)
  const { loading, error, product } = productDetails

  const areUsersNotLoadedYet = loadingUserState === LoadingUserState.NotLoadedYet;

  if (areUsersNotLoadedYet) {
    dispatch(listUsers());
    dispatch(usersRelatedToProduct(productId));
  }

  const validateBeforeSaving = (judges) => {
    const validationResult = { isValid: false, errorMsg: null };
    if (!judges) {
      validationResult.isValid = false;
      validationResult.errorMsg = 'Invalid judges.';
      return validationResult;
    }
    if (judges.length === 0) {
      validationResult.isValid = false;
      validationResult.errorMsg = 'Judges must not be empty. Please add at least one judge.';
      return validationResult;
    }
    validationResult.isValid = true;
    return validationResult;
  }

  const modelJudgesForSaving = (judges) => {
    return judges.map(j => j.id);
  }

  const submitHandler = (e) => {
    e.preventDefault();
    const validationResult = validateBeforeSaving(selectedJudges);
    if (!validationResult.isValid) {
      return;
    }
    const modeledJudges = modelJudgesForSaving(selectedJudges);
    dispatch(saveJudgesForAProduct(productId, modeledJudges))
    history.push('/admin/productlist');
  }

  return (
    <>
      <Link to='/admin/productlist' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1>Add Judge</h1>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group style={{ marginTop: '20px' }}>
              <Form.Label>Multiple Selections</Form.Label>
              <Typeahead
                id="basic-typeahead-multiple"
                labelKey="name"
                multiple
                onChange={selectJudge}
                placeholder="Choose judges for this project"
                // selected={multiSelections}
                options={judgeDataSource}
                selected={selectedJudges}
              />
            </Form.Group>

            <Button type='submit' variant='primary'>
              Save
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  )
}

export default ProductAssignScreen
