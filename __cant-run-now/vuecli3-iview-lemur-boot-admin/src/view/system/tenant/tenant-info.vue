<template>
  <Modal v-model="isShow" width="65%" :closable="false" :mask-closable="false">
    <div slot="header" class="info-header">
      <div class="ivu-modal-header-inner">用户管理</div>
      <a class="ivu-modal-close" @click="closeModel"><i class="ivu-icon ivu-icon-ios-close"></i></a>
    </div>
    <div>
      <Form ref="tenantForm" :model="form" :label-width="80" :rules="ruleValidate">
        <Row>
          <Col span="8">
            <FormItem label="名称" prop="name">
              <Input v-model="form.name" placeholder="众一"></Input>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="类型">
              <Select v-model="form.merType">
                <Option :value="Item.key" v-for="Item in merTypeOptions" :key="Item">{{Item.name}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="营业执照">
              <Input v-model="form.creditCode" ></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <FormItem label="联系人"  prop="linkman">
              <Input v-model="form.linkman" />
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="联系电话"  prop="phone">
              <Input v-model="form.phone" />
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="地址" prop="address">
              <Input v-model="form.address"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <FormItem label="短信签名">
              <Input v-model="form.smsSign"></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </div>
    <div slot="footer">
      <Button @click="closeModel">取消</Button>
      <Button type="primary" @click="submit">提交</Button>
    </div>
  </Modal>
</template>

<script>

import { C, U } from '@/libs/api.request'
import { Dict } from '@/libs/common.request'

export default {
  name: 'tenant-info',
  data () {
    return {
      form: {},
      isShow: false,
      type: 'add',
      ruleValidate: {
        name: [
          { required: true, message: '账户不允许为空', trigger: 'blur' }
        ],
        linkman: [
          { required: true, message: '联系人不允许为空', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '电话不允许为空', trigger: 'blur' }
        ]
      },
      merTypeOptions: []
    }
  },
  created: function () {
    Dict('tenant_type').then(data => {
      this.merTypeOptions = data
    })
  },
  methods: {
    openModel (type, data) {
      this.isShow = true
      this.type = type
      if (data) {
        this.form = data
      } else {
        this.form = {}
      }
    },
    closeModel () {
      this.isShow = false
    },
    submit () {
      this.$refs.tenantForm.validate((valid) => {
        if (valid) {
          switch (this.type) {
            case 'create':
              C('tenant', this.form).then(data => {
                this.isShow = false
                this.$emit('handleSearch')
              })
              break
            case 'update':
              U('tenant', this.form).then(data => {
                this.isShow = false
                this.$emit('handleSearch')
              })
              break
          }
        } else {
          this.$Message.error('请检查填写的数据')
        }
      })
    }
  }
}
</script>

<style scoped>
  .info-header {
    height: 40px;
    color: #31708f;
    background-color: #d9edf7;
    border-color: #bce8f1;
  }

  .ivu-modal-header-inner {
    margin: 10px 15px 0px 0px;
    padding-left: 15px;
    height: 40px;
  }

  .ivu-modal-close {
    margin: 10px 15px 0px 0px;
  }

  .ivu-form-item {
    width: 260px;
  }
</style>
