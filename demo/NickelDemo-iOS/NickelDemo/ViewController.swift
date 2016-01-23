//
//  ViewController.swift
//  NickelDemo
//
//  Created by Riana Ralambomanana on 23/01/2016.
//  Copyright © 2016 riana.io. All rights reserved.
//

import UIKit
import NickelSwift
import SwiftyJSON

class ViewController: NickelWebViewController {
    
    var store:NickelStore?;
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        setMainPage("www/index")
//        NickelStore.drop()
        store = NickelStore()
        
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    // The wiew has loaded
    override func didFinishLoading() {
        registerBridgedFunction("storeObject", bridgedMethod: self.storeObject)
        registerBridgedFunction("loadAllObjects", bridgedMethod: self.loadAllObjects)
        registerBridgedFunction("deleteObject", bridgedMethod: self.deleteObject)
        
        
    }
    
    func storeObject(operation:String, content:[NSObject:AnyObject]) -> [NSObject:AnyObject]?{
        let type = content["type"] as! String
        let id = content["id"] as! String
        let data = content["data"] as! String
        let indexed = content["indexed"] as! [String]
        
        self.store!.save(type, id: id, data: data, indexed: indexed)
        return [NSObject:AnyObject]()
    }
    
    func deleteObject(operation:String, content:[NSObject:AnyObject]) -> [NSObject:AnyObject]?{
        let type = content["type"] as! String
        let id = content["id"] as! String
        self.store!.delete(type, id: id)
        return [NSObject:AnyObject]()
    }

    
    func loadAllObjects(operation:String, content:[NSObject:AnyObject]) -> [NSObject:AnyObject]?{
        let type = content["type"] as! String
        let content = self.store!.loadAll(type)
        let jsonContent = JSON(content)
        if let stringResult = jsonContent.rawString() {
            print(stringResult)
            return ["data" : stringResult]
        }
        
        return [NSObject:AnyObject]()
    }
    
    
    
}

