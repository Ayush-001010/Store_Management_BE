import { Request, Response } from "express";
import model from "../model/model";
import { Op } from "sequelize";

export const getUserDetails = async (req: Request, res: Response) => {
    try {
        const { organizationID , searchStr } = req.body;
        const response = await model.UsersTable.findAll({
            where: {
                OrganizationID: organizationID,
                userName: {
                    [Op.like]: `%${searchStr}%`,
                }
            }
        });
        return res.send({
            success: true,
            data : response.map((item: any) => {
                return { id: item.ID, name: item.userName , image : item.userProfileImage };
            })
        });
    } catch (error) {
        console.log("Error ", error);
        return res.send({success : false, data: "Something went wrong"});
    }
};

export const createChatRoom = async (req: Request, res: Response) => {
    try {
        const { data } = req.body;
        const chatRoomResponse = await model.ChatRoomTable.create({
            roomName : data.roomType === "one-to-one" ? "" : data.groupName,
            roomType : data.roomType,
            createdBy : data.createdBy,
            lastMessageTime : null,
            lastMessageText : null,
            organizationId: data.organizationId,
        });
        await data.members.forEach(async (member: any) => {
            await model.ChatParticipantsTable.create({
                chatRoomID : chatRoomResponse.get('ID'),
                userID : member,
                joinedAt : new Date(),
                lastSeenMessageID : null,
                isPinned : false,
                customNickname :  data.nickName ,
                isActive : true,
            });
        });
        await model.ChatParticipantsTable.create({
            chatRoomID : chatRoomResponse.get('ID'),
            userID : data.userID,
            joinedAt : new Date(),
            lastSeenMessageID : null,
            isPinned : false,
            customNickname :  data.nickName ,
            isActive : true,
        });
        return res.send({success : true, data: "Chat room created successfully"});
    } catch (error) {
        console.log("Error ", error);
        return res.send({success : false, data: "Something went wrong"});
    }
};

export const getChatRooms = async (req: Request, res: Response) => {
    try {
        const { userID , pageNo } = req.body;
        const limit = 5;
        const response = await model.ChatParticipantsTable.findAll({
            where: {
                userID,
                isActive : true,
            },
            include : [
                {
                    model : model.ChatRoomTable,
                    as : "chatRoomDetails",
                }
            ],
            order:[
                [{model : model.ChatRoomTable, as : "chatRoomDetails"}, 'lastMessageTime', 'DESC']
            ],
            offset : (pageNo - 1) * limit,
            limit : limit,
        });
        for(const item of response){
            const {roomType} = item.dataValues.chatRoomDetails.dataValues;
            // console.log("roomType ", item.dataValues.chatRoomDetails.dataValues);  
            if(roomType === "one-to-one"){
                // console.log("item ", item.dataValues);
                const participants = await model.ChatParticipantsTable.findAll({
                    where : {
                        chatRoomID : item.dataValues.chatRoomID,
                        userID : {
                            [Op.ne] : userID,
                        }
                    }
                });
                if(participants.length > 0){
                    const userDetails = await model.UsersTable.findOne({
                        where : {
                            ID : participants[0].dataValues.userID,
                        }
                    });
                    item.dataValues.chatRoomDetails.dataValues.roomName = userDetails?.dataValues.userName;
                    item.dataValues.chatRoomDetails.dataValues.chatRoomImage = userDetails?.dataValues.userProfileImage;
                }
            }
        }
        return res.send({success : true, data: response});
    } catch (error) {
        console.log("Error ", error);
        return res.send({success : false, data: "Something went wrong"});
    }
};

export const getChatMessages = async (req: Request, res: Response) => {
    try {
        const {chatRoomID , pageNo}=req.body;
        const response = await model.MessageTable.findAll({
            where : {
                chatRoomID,
            },
            order : [['createdAt', 'DESC'] ],
            offset : (pageNo - 1) * 20, 
            limit : 20,
        });
        return res.send({success : true, data: response});
    } catch (error) {
        console.log("Error ", error);
        return res.send({success : false, data: "Something went wrong"});
    }
};

export const getCountOfFileType = async (req: Request, res: Response) => {
    try {
        const {type , chatRoomID} = req.body;
        switch(type){
            case "Image" : {
                const response = await model.MessageTable.count({
                    where : {
                        messageType : "file",
                        fileType : "Image",
                        chatRoomID
                    },
                });
                return res.send({success : true, data: response});
            }
            case "Other" : {
                const response = await model.MessageTable.count({
                    where : {
                        messageType : "file",
                        fileType : "Other",
                        chatRoomID
                    },
                });
                return res.send({success : true, data: response});
            }
        }
    } catch (error) {
        console.log("Error ", error);
        return res.send({success : false, data: "Something went wrong"});
    }
};

export const getFilesAndImages = async (req: Request, res: Response) => {
    try {
        const {chatRoomID , type } = req.body;
        switch(type){
            case "Image" : {
                const response = await model.MessageTable.findAll({
                    where : {
                        messageType : "file",
                        fileType : "Image",
                        chatRoomID
                    },
                });
                return res.send({success : true, data: response.map((item: any) => {
                    return {
                        ID : item.ID,
                        fileURL : item.fileURL,
                        senderName : item.senderName,
                        createdAt : item.createdAt,
                    };
                })});
            }
            case "Other" : {
                const response = await model.MessageTable.findAll({
                    where : {
                        messageType : "file",
                        fileType : "Other",
                        chatRoomID
                    },
                });
                return res.send({success : true, data: response.map((item: any) => {
                    return {
                        ID : item.ID,
                        fileURL : item.fileURL,
                        senderName : item.senderName,
                        createdAt : item.createdAt,
                    };
                })});
            }
        }
    } catch (error) {
        console.log("Error ", error);
        return res.send({success : false, data: "Something went wrong"});
    }
};