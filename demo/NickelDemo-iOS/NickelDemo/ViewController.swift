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
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setMainPage("www/index")
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    // The wiew has loaded
    override func didFinishLoading() {

        
    }
    
}

